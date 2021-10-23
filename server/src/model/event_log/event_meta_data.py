"""Event Metadata for Event Log."""
# 'annotations' import neede to return enclosing type:
# https://www.python.org/dev/peps/pep-0563/
from __future__ import annotations

from mongoengine.document import EmbeddedDocument
from mongoengine.fields import IntField


class EventMetaData(EmbeddedDocument):
    """Meta data for Event."""

    meta = {"allow_inheritance": True}
    version = IntField(required=True)


class UserSignInEventMetaData(EventMetaData):
    """Metadata for user sign in event."""

    myVersion = 1

    def __init__(self) -> None:
        """Create new UserSignInEventMetaData with proper version."""
        super().__new__(version=self.myVersion)


class UserSignUpEventMetaData(EventMetaData):
    """Metadata for user sign up event."""

    myVersion = 1

    def __init__(self) -> None:
        """Create new UserSignInEventMetaData with proper version."""
        super().__new__(version=self.myVersion)
