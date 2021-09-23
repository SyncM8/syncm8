"""MongoDb user model."""
# 'annotations' import neede to return enclosing type:
# https://www.python.org/dev/peps/pep-0563/
from __future__ import annotations

from typing import Optional, Tuple, cast

from flask_login import UserMixin
from mongoengine import Document, StringField

from ..clients.google import get_user_info
from ..utils.error import AppError, ErrorCode, error_bounded


class User(Document, UserMixin):
    """User model class that stores ID."""

    first_name = StringField(required=True, max_length=100)
    google_id = StringField()
    google_token = StringField()
    picture_url = StringField()
    email = StringField(required=True, max_length=320)
    meta = {"collection": "users"}

    def get_id(self) -> str:
        """Return string version of mongo oid."""
        return str(self.id)

    @staticmethod
    @error_bounded(
        (AppError(ErrorCode.MONGO_ERROR, "Mongo error when adding google user"), None)
    )
    def add_google_user(token: str,) -> Tuple[Optional[AppError], Optional[User]]:
        """
        Add or update new google user.

        If user with same google id exists, update the store access token.
        If no user exists, store new user in db.
        """
        error, user_info = get_user_info(
            token=token, fields=["given_name", "email", "picture", "id"]
        )

        if not error and user_info:
            existing_user = User.lookup_google_user(user_info["id"])
            if existing_user:
                existing_user.google_token = token
                existing_user.save()
                return (None, existing_user)
            else:
                newUser = User(
                    first_name=user_info["given_name"],
                    google_id=user_info["id"],
                    google_token=token,
                    picture_url=user_info["picture"],
                    email=user_info["email"],
                )
                newUser.save()
                return (None, newUser)
        else:
            return (error, None)

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
        return "User, oid: {0}, first_name: {1}, email: {2}".format(
            self.id, self.first_name, self.email
        )
