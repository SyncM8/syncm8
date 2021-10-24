"""MongoDb sync model."""
# 'annotations' import neede to return enclosing type:
# https://www.python.org/dev/peps/pep-0563/
from __future__ import annotations

from datetime import datetime
from typing import Optional, Tuple

from mongoengine import DateTimeField, Document, StringField
from src.utils.error import AppError, ErrorCode, error_bounded


class Sync(Document):
    """Sync model class."""

    timestamp = DateTimeField(required=True, default=datetime.now)
    title = StringField()
    details = StringField()

    meta = {"collection": "syncs", "strict": False}

    def get_id(self) -> str:
        """Return string version of mongo oid."""
        return str(self.id)

    @staticmethod
    @error_bounded(
        (AppError(ErrorCode.MONGO_ERROR, "Mongo error when adding new sync"), None)
    )
    def add_new_sync(
        timestamp: datetime, title: str = "", details: str = ""
    ) -> Tuple[Optional[AppError], Optional[Sync]]:
        """Add new sync with the given timestamp."""
        sync = Sync(timestamp=timestamp, title=title, details=details)
        sync.save()
        return (None, sync)
