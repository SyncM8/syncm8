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
from src.clients.google import (
    get_google_person_list,
    get_user_info,
    is_google_token_valid,
)
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


def test_get_google_person_list_happy_single() -> None:
    """Test happy path for get google person list."""
    discovery_mock = Path(
        os.path.join(os.path.dirname(__file__), "people-discovery.json")
    ).read_text()

    http = HttpMockSequence([({"status": "200"}, discovery_mock)])
    setattr(http, "close", lambda: None)

    myName = "Albert Einstein"
    myEmail = "albert@google.com"
    myPicture = "albert-picture.com"
    http2 = HttpMockSequence(
        [
            (
                {"status": "200"},
                json.dumps(
                    {
                        "connections": [
                            {
                                "emailAddresses": [
                                    {"value": myEmail},
                                    {"value": "testNonDefaultEmail"},
                                ],
                                "names": [
                                    {"displayName": myName},
                                    {"value": "testNonDefaultName"},
                                ],
                                "photos": [
                                    {"url": myPicture},
                                    {"value": "testNonDefaultPicture"},
                                ],
                            }
                        ]
                    }
                ),
            )
        ]
    )

    error, googlePersonList = get_google_person_list(token="", http=http, http2=http2)
    assert not error
    assert googlePersonList is not None
    assert len(googlePersonList) == 1
    assert googlePersonList[0].name == myName
    assert googlePersonList[0].email == myEmail
    assert googlePersonList[0].profilePictureURL == myPicture


def test_get_google_person_list_happy_multiple() -> None:
    """Test happy path for get google person list."""
    discovery_mock = Path(
        os.path.join(os.path.dirname(__file__), "people-discovery.json")
    ).read_text()

    http = HttpMockSequence([({"status": "200"}, discovery_mock)])
    setattr(http, "close", lambda: None)

    testData = [
        {
            "name": "Albert1 Einstein",
            "email": "albert2@google.com",
            "picture": "albert1-picture.com",
        },
        {
            "name": "Albert2 Einstein",
            "email": "albert2@google.com",
            "picture": "albert2-picture.com",
        },
        {
            "name": "Albert3 Einstein",
            "email": "albert3@google.com",
            "picture": "albert3-picture.com",
        },
    ]
    http2 = HttpMockSequence(
        [
            (
                {"status": "200"},
                json.dumps(
                    {
                        "connections": [
                            {
                                "emailAddresses": [
                                    {"value": testData[0]["email"]},
                                    {"value": "testNonDefaultEmail"},
                                ],
                                "names": [
                                    {"displayName": testData[0]["name"]},
                                    {"value": "testNonDefaultName"},
                                ],
                                "photos": [
                                    {"url": testData[0]["picture"]},
                                    {"value": "testNonDefaultPicture"},
                                ],
                            },
                            {
                                "emailAddresses": [
                                    {"value": testData[1]["email"]},
                                    {"value": "testNonDefaultEmail"},
                                ],
                                "names": [
                                    {"displayName": testData[1]["name"]},
                                    {"value": "testNonDefaultName"},
                                ],
                                "photos": [
                                    {"url": testData[1]["picture"]},
                                    {"value": "testNonDefaultPicture"},
                                ],
                            },
                            {
                                "emailAddresses": [
                                    {"value": testData[2]["email"]},
                                    {"value": "testNonDefaultEmail"},
                                ],
                                "names": [
                                    {"displayName": testData[2]["name"]},
                                    {"value": "testNonDefaultName"},
                                ],
                                "photos": [
                                    {"url": testData[2]["picture"]},
                                    {"value": "testNonDefaultPicture"},
                                ],
                            },
                        ]
                    }
                ),
            )
        ]
    )

    error, googlePersonList = get_google_person_list(token="", http=http, http2=http2)
    assert not error
    assert googlePersonList is not None
    assert len(googlePersonList) == 3
    assert googlePersonList[0].name == testData[0]["name"]
    assert googlePersonList[0].email == testData[0]["email"]
    assert googlePersonList[0].profilePictureURL == testData[0]["picture"]
    assert googlePersonList[1].name == testData[1]["name"]
    assert googlePersonList[1].email == testData[1]["email"]
    assert googlePersonList[1].profilePictureURL == testData[1]["picture"]
    assert googlePersonList[2].name == testData[2]["name"]
    assert googlePersonList[2].email == testData[2]["email"]
    assert googlePersonList[2].profilePictureURL == testData[2]["picture"]


def test_get_google_person_list_empty() -> None:
    """Test empty case for get google person list."""
    discovery_mock = Path(
        os.path.join(os.path.dirname(__file__), "people-discovery.json")
    ).read_text()

    http = HttpMockSequence([({"status": "200"}, discovery_mock)])
    setattr(http, "close", lambda: None)

    http2 = HttpMockSequence([({"status": "200"}, json.dumps({"connections": []}))])

    error, googlePersonList = get_google_person_list(token="", http=http, http2=http2)
    assert not error
    assert googlePersonList is not None
    assert len(googlePersonList) == 0


def test_get_google_person_list_expired() -> None:
    """Test expired token for get google person list."""
    discovery_mock = Path(
        os.path.join(os.path.dirname(__file__), "people-discovery.json")
    ).read_text()

    http = HttpMockSequence([({"status": "410"}, discovery_mock)])
    setattr(http, "close", lambda: None)

    http2 = HttpMockSequence([({"status": "410"},)])

    error, googlePersonList = get_google_person_list(token="", http=http, http2=http2)
    assert error
    assert googlePersonList is None


def test_get_google_person_list_quota() -> None:
    """Test quota exceeded for get google person list."""
    discovery_mock = Path(
        os.path.join(os.path.dirname(__file__), "people-discovery.json")
    ).read_text()

    http = HttpMockSequence([({"status": "429"}, discovery_mock)])
    setattr(http, "close", lambda: None)

    http2 = HttpMockSequence([({"status": "429"},)])

    error, googlePersonList = get_google_person_list(token="", http=http, http2=http2)
    assert error
    assert googlePersonList is None
