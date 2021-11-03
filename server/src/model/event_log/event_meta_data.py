"""Event Metadata for Event Log."""

from mongoengine.document import EmbeddedDocument
from mongoengine.fields import IntField


class EventMetaData(EmbeddedDocument):
    """Meta data for Event."""

    meta = {"allow_inheritance": True}
    version = IntField(required=True)


class UserSignInEventMetaData(EventMetaData):
    """Metadata for user sign in event."""

    v = 1

    def __init__(self) -> None:
        """Create new UserSignInEventMetaData with proper version."""
        super().__init__()
        self.version = UserSignInEventMetaData.v


class UserSignUpEventMetaData(EventMetaData):
    """Metadata for user sign up event."""

    v = 1

    def __init__(self) -> None:
        """Create new UserSignUpEventMetaData with proper version."""
        super().__init__()
        self.version = UserSignUpEventMetaData.v
