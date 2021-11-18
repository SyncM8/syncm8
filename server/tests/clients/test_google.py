"""
Test the google client module.

Find discovery paths for http mocking the build queries at:
https://discovery.googleapis.com/discovery/v1/apis
"""
import json
import os
from pathlib import Path
from typing import Optional, Tuple

from googleapiclient.http import HttpMockSequence
from pytest import MonkeyPatch
from src.clients.google import get_user_info, is_google_token_valid
from src.utils.error import AppError, ErrorCode


def patch_is_google_token_valid(
    retAudience: str, retExpiresIn: int, retUserId: str
) -> Tuple[Optional[AppError], bool]:
    """Mock responses for is google token valid."""
    discovery_mock = Path(
        os.path.join(os.path.dirname(__file__), "oauth2-discovery.json")
    ).read_text()

    http = HttpMockSequence([({"status": "200"}, discovery_mock)])
    setattr(http, "close", lambda: None)
    http2 = HttpMockSequence(
        [
            (
                {"status": "200"},
                json.dumps(
                    {
                        "audience": retAudience,
                        "email": "albert@google.com",
                        "expires_in": retExpiresIn,
                        "issued_to": "anyone",
                        "scope": "any, tbh",
                        "user_id": retUserId,
                        "verified_email": True,
                    }
                ),
            )
        ]
    )

    return is_google_token_valid("", http, http2)


def test_is_google_token_valid_happy(monkeypatch: MonkeyPatch) -> None:
    """Test happy path for is google token valid."""
    validAudience = "I am the audience"
    monkeypatch.setenv("GOOGLE_CLIENT_ID", validAudience)
    error, valid = patch_is_google_token_valid(validAudience, 5000, "myUserId")
    assert valid
    assert not error


def test_is_google_token_invalid_audience(monkeypatch: MonkeyPatch) -> None:
    """Test invalid audience for is google token valid."""
    validAudience = "I am the audience"
    monkeypatch.setenv("GOOGLE_CLIENT_ID", validAudience)
    error, valid = patch_is_google_token_valid("not valid Audience", 5000, "myUserId")
    assert not valid
    assert error is not None
    assert error.status_code == ErrorCode.INVALID_AUDIENCE_GOOGLE_TOKEN


def test_is_google_token_invalid_expiry(monkeypatch: MonkeyPatch) -> None:
    """Test expired token for is google token valid."""
    validAudience = "I am the audience"
    monkeypatch.setenv("GOOGLE_CLIENT_ID", validAudience)
    error, valid = patch_is_google_token_valid(validAudience, 0, "myUserId")

    assert not valid
    assert error is not None
    assert error.status_code == ErrorCode.EXPIRED_GOOGLE_TOKEN


def test_is_google_token_invalid_userid(monkeypatch: MonkeyPatch) -> None:
    """Test missing username for is google token valid."""
    validAudience = "I am the audience"
    monkeypatch.setenv("GOOGLE_CLIENT_ID", validAudience)
    error, valid = patch_is_google_token_valid(validAudience, 5000, "")

    assert not valid
    assert error is not None
    assert error.status_code == ErrorCode.NO_GOOGLE_ID_GOOGLE_TOKEN


def test_get_user_info_happy() -> None:
    """Test happy path for get user info."""
    discovery_mock = Path(
        os.path.join(os.path.dirname(__file__), "oauth2-discovery.json")
    ).read_text()

    http = HttpMockSequence([({"status": "200"}, discovery_mock)])
    setattr(http, "close", lambda: None)

    myName = "Albert Einstein"
    myEmail = "albert@google.com"
    myPicture = "albert-picture.com"
    myId = "1234"
    http2 = HttpMockSequence(
        [
            (
                {"status": "200"},
                json.dumps(
                    {
                        "given_name": myName,
                        "email": myEmail,
                        "picture": myPicture,
                        "id": myId,
                    }
                ),
            )
        ]
    )

    error, userInfo = get_user_info(token="", http=http, http2=http2)
    assert not error
    assert userInfo is not None
    assert userInfo["given_name"] == myName
    assert userInfo["email"] == myEmail
    assert userInfo["id"] == myId
    assert userInfo["picture"] == myPicture
