"""MongoDb user model."""
# 'annotations' import neede to return enclosing type:
# https://www.python.org/dev/peps/pep-0563/
from __future__ import annotations

from typing import List, Optional, Tuple, cast

from bson.objectid import ObjectId
from flask_login import UserMixin
from mongoengine import Document, LazyReferenceField, ListField, StringField
from src.clients.google import get_user_info
from src.model.family import Family
from src.types.new_family import STARTER_FAMILIES, UNASSIGNED_FAMILY
from src.utils.error import AppError, ErrorCode, error_bounded


class User(Document, UserMixin):
    """User model class that stores ID."""

    first_name = StringField(required=True, max_length=100)
    google_id = StringField()
    google_token = StringField()
    picture_url = StringField()
    unassigned_family_id = LazyReferenceField(Family, required=True)
    email = StringField(required=True, max_length=320)
    family_ids = ListField(LazyReferenceField(Family), required=True, default=list)
    meta = {"collection": "users", "strict": False}

    def get_id(self) -> str:
        """Return string version of mongo oid."""
        return str(self.id)

    @staticmethod
    @error_bounded(
        (AppError(ErrorCode.MONGO_ERROR, "Mongo error when adding google user"), None)
    )
    def add_google_user(token: str) -> Tuple[Optional[AppError], Optional[User]]:
        """
        Add or update new google user.

        If user with same google id exists, update the store access token.
        If no user exists, store new user in db.
        """
        error, user_info = get_user_info(
            token=token, fields=["given_name", "email", "picture", "id"]
        )

        if error or not user_info:
            return (error, None)

        existing_user = User.lookup_google_user(user_info["id"])
        if existing_user:
            existing_user.google_token = token
            existing_user.save()
            return (None, existing_user)

        # Create Unassigned family
        unassigned_family_error, unassigned_family = Family.add_new_family(
            UNASSIGNED_FAMILY.name, UNASSIGNED_FAMILY.sync_interval_days
        )
        if unassigned_family_error or not unassigned_family:
            return (unassigned_family_error, None)

        # Create starter families
        family_ids: List[ObjectId] = [unassigned_family.id]
        for starter_family in STARTER_FAMILIES:
            family_error, family = Family.add_new_family(
                starter_family.name, starter_family.sync_interval_days
            )
            if family_error or not family:
                return (family_error, None)
            family_ids.append(family.id)

        newUser = User(
            first_name=user_info["given_name"],
            google_id=user_info["id"],
            google_token=token,
            picture_url=user_info["picture"],
            email=user_info["email"],
            unassigned_family_id=unassigned_family.id,
            family_ids=family_ids,
        )
        newUser.save()
        return (None, newUser)

    @staticmethod
    @error_bounded(None)
    def lookup_google_user(google_id: str) -> Optional[User]:
        """Lookup user with specified google id in db."""
        return cast(User, User.objects(google_id=google_id).first())

    @staticmethod
    @error_bounded(None)
    def lookup_user(id: str) -> Optional[User]:
        """Lookup user by oID in db."""
        return cast(User, User.objects(pk=id).first())

    def __str__(self) -> str:
        """Return string representation of user."""
        return (
            f"User, oid: {self.id}, first_name: {self.first_name}, email: {self.email}"
        )
