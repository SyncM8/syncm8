"""MongoDb family model."""
# 'annotations' import needs to return enclosing type:
# https://www.python.org/dev/peps/pep-0563/
from __future__ import annotations

from typing import Optional, Tuple, cast

from mongoengine import Document, IntField, ListField, ObjectIdField, StringField
from src.utils.error import AppError, ErrorCode, error_bounded


class Family(Document):
    """Family model class that stores ID."""

    sync_interval_days = IntField(required=True)
    name = StringField(required=True)
    mate_ids = ListField(ObjectIdField(), default=list)

    meta = {"collection": "families", "strict": False}

    def get_id(self) -> str:
        """Return string version of mongo oid."""
        return str(self.id)

    @staticmethod
    @error_bounded(None)
    def lookup_family(id: str) -> Optional[Family]:
        """Lookup family by oID in db."""
        return cast(Family, Family.objects(pk=id).first())

    @staticmethod
    @error_bounded(
        (AppError(ErrorCode.MONGO_ERROR, "Mongo error when adding new family"), None)
    )
    def add_new_family(
        name: str, sync_interval_days: int
    ) -> Tuple[Optional[AppError], Optional[Family]]:
        """Add a new family."""
        family = Family(name=name, sync_interval_days=sync_interval_days)
        family.save()
        return (None, family)
