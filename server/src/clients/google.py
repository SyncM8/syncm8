"""
Moddule to facilitate interaction with the google api.

How to use google api:
https://github.com/googleapis/google-api-python-client/blob/main/docs/start.md

Google api library reference:
https://github.com/googleapis/google-api-python-client/blob/main/docs/dyn/index.md
"""

import os
from typing import Dict, List, Optional, Tuple

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from ..utils.error import AppError, ErrorCode, error_bounded


@error_bounded(
    (AppError(ErrorCode.GOOGLE_API_ERROR, "Google api error - is token valid"), False)
)
def is_google_token_valid(token: str,) -> Tuple[Optional[AppError], bool]:
    """
    Check wheter or not the JWT is a valid google access token.

    Determines wheter or not the given JWT is:
    - not expires
    - was issued by google
    - is allowed to be used by our app
    """
    with build("oauth2", "v2") as service:
        token_info_request = service.tokeninfo(access_token=token)
        token_info = token_info_request.execute()

        expires_in = token_info.get("expires_in", 0)
        if expires_in <= 0:
            return (AppError(ErrorCode.EXPIRED_GOOGLE_TOKEN, "Token is expired"), False)

        audience = token_info.get("audience", "")
        if not audience == os.environ.get("GOOGLE_CLIENT_ID"):
            return (
                AppError(
                    ErrorCode.INVALID_AUDIENCE_GOOGLE_TOKEN,
                    "Token is not valid for this app",
                ),
                False,
            )

        google_id = token_info.get("user_id", "")
        if not google_id:
            return (
                AppError(ErrorCode.NO_GOOGLE_ID_GOOGLE_TOKEN, "No user id found"),
                False,
            )

        return (None, True)


@error_bounded(
    (AppError(ErrorCode.GOOGLE_API_ERROR, "Google api error - get user info"), False)
)
def get_user_info(
    token: str, fields: List[str] = ["name", "email", "picture", "id"]
) -> Tuple[Optional[AppError], Optional[Dict[str, str]]]:
    """
    Request user's information from google using the provided token.

    Returns the requested fields from the user's information if they exist in
    the form of a dictionary.
    """
    with build("oauth2", "v2", credentials=Credentials(token)) as service:
        user_info = service.userinfo().get().execute()

        parsed_user_info = {}
        for field in fields:
            parsed_user_info[field] = user_info.get(field, "")

        return (None, parsed_user_info)