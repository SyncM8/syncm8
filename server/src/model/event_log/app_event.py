"""MongoDb event model. Used for generating the event log."""


from datetime import datetime

from flask_login import current_user
from mongoengine import Document, StringField
from mongoengine.fields import DateTimeField, EmbeddedDocumentField, EnumField

from .event_action_type import EventActionType
from .event_meta_data import EventMetaData


class AppEvent(Document):
    """Event model - created whenever db is modified."""

    time_stamp = DateTimeField(required=True, default=datetime.utcnow())
    user_id = StringField(required=True)
    action = EnumField(EventActionType, required=True)
    meta_data = EmbeddedDocumentField(EventMetaData)

    def __init__(
        self, action: EventActionType, meta_data: EventMetaData, user_id: str = ""
    ) -> None:
        """Create and save an AppEvent."""
        if not user_id:
            user_id = current_user.get_id() if current_user else ""

        super().__init__(user_id=user_id, action=action, meta_data=meta_data)
        self.save()
