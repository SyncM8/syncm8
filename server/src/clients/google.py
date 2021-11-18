"""
Moddule to facilitate interaction with the google api.

How to use google api:
https://github.com/googleapis/google-api-python-client/blob/main/docs/start.md

Google api library reference:
https://github.com/googleapis/google-api-python-client/blob/main/docs/dyn/index.md
"""

import os
from typing import Dict, List, Optional, Tuple

import httplib2
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from ..utils.error import AppError, ErrorCode, error_bounded


@error_bounded(
    (AppError(ErrorCode.GOOGLE_API_ERROR, "Google api error - is token valid"), False)
)
def is_google_token_valid(
    token: str,
    http: Optional[httplib2.Http] = None,
    http2: Optional[httplib2.Http] = None,
) -> Tuple[Optional[AppError], bool]:
    """
    Check wheter or not the JWT is a valid google access token.

    Determines wheter or not the given JWT is:
    - not expired
    - was issued by google
    - is allowed to be used by our app

    (NB: the htto and http2 parameters are only used during testing - if you can figure
    out a better way to make the tests work, go ahead and remove them)
    """
    with build("oauth2", "v2", http=http) as service:
        token_info_request = service.tokeninfo(access_token=token)
        token_info = token_info_request.execute(http=http2)

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
    (AppError(ErrorCode.GOOGLE_API_ERROR, "Google api error - get user info"), None)
)
def get_user_info(
    token: str,
    fields: List[str] = ["given_name", "email", "picture", "id"],
    http: Optional[httplib2.Http] = None,
    http2: Optional[httplib2.Http] = None,
) -> Tuple[Optional[AppError], Optional[Dict[str, str]]]:
    """
    Request user's information from google using the provided token.

    Returns the requested fields from the user's information if they exist in
    the form of a dictionary.

    (NB: the htto and http2 parameters are only used during testing - if you can figure
    out a better way to make the tests work, go ahead and remove them)
    """
    creds = Credentials(token) if token else None
    with build("oauth2", "v2", credentials=creds, http=http) as service:
        user_info = service.userinfo().get().execute(http=http2)

        parsed_user_info = {}
        for field in fields:
            parsed_user_info[field] = user_info.get(field, "")

        return (None, parsed_user_info)


@error_bounded(
    (AppError(ErrorCode.GOOGLE_API_ERROR, "Google api error - get user contacts"), None)
)
def get_people_connections_list(token: str,) -> Tuple[Optional[AppError], List[object]]:
    """
    Request list of user's contacts from Google People API.

    Returns a list of Google API Person objects representing all
    of the user's contacts
    """
    creds = Credentials(token) if token else None
    with build("people", "v1", credentials=creds) as people_service:
        pagination_finished = False
        next_page_token = ""
        people_list_complete = []
        # paginate through contacts and add to list
        while not pagination_finished:
            people_response = (
                people_service.people()
                .connections()
                .list(
                    resourceName="people/me",
                    personFields="names,emailAddresses",
                    pageToken=next_page_token,
                )
            ).execute()
            people_list_complete += people_response["connections"]
            if "nextPageToken" in people_response:
                next_page_token = people_response["nextPageToken"]
            else:
                pagination_finished = True

        return (None, people_list_complete)
