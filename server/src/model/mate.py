"""MongoDb mate model."""
# 'annotations' import needs to return enclosing type:
# https://www.python.org/dev/peps/pep-0563/
from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Tuple, cast

from dateutil.parser import isoparse  # type: ignore
from mongoengine import Document, LazyReferenceField, ListField, StringField
from src.gql.graphql import NewMatesInput
from src.model.sync import Sync
from src.utils.error import AppError, ErrorCode, error_bounded


class Mate(Document):
    """Mate model class."""

    name = StringField(required=True, max_length=100)
    sync_ids = ListField(LazyReferenceField(Sync), default=list)
    meta = {"collection": "mates", "strict": False}

    @property
    def syncs(self) -> List[Sync]:
        """Fetch object for sync_ids."""
        return list(Sync.objects.in_bulk([ref.id for ref in self.sync_ids]).values())

    def get_id(self) -> str:
        """Return string version of mongo oid."""
        return str(self.id)

    @staticmethod
    @error_bounded(
        (
            AppError(ErrorCode.MONGO_ERROR, "Mongo error when bulk adding new mates"),
            None,
        )
    )
    def bulk_insert_new_mates(
        mates: List[NewMatesInput],
    ) -> Tuple[Optional[AppError], Optional[List[Mate]]]:
        """Add multiple new mates."""
        if len(mates) == 0:
            return (None, [])

        new_mates: List[Mate] = []
        for mate in mates:
            timestamp = isoparse(mate.get("lastSynced", datetime.now().isoformat()))
            sync_error, sync = Sync.add_new_sync(timestamp)
            if sync_error or not sync:
                return (sync_error, sync)
            new_mates.append(Mate(name=mate.get("name"), sync_ids=[sync.id]))

        created_mates = Mate.objects.insert(new_mates)
        return (None, cast(List[Mate], created_mates))
