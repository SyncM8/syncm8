"""Test the api."""
from typing import Any, Generator, cast
from unittest.mock import Mock

import pytest
from flask.testing import FlaskClient
from pytest_mock import MockerFixture
from src.api import IsLoggedInResponse, LoginResponse, app
from src.model.user import User
from src.utils.error import AppError, ErrorCode


@pytest.fixture
def client() -> Generator[FlaskClient, None, None]:
    """Get client api app for testing."""
    with app.test_client() as client:
        yield client


def test_test_route(client: FlaskClient) -> None:
    """Test that test endpoint is working."""
    res = client.get("/test")
    assert res.status_code == 200
    assert b"test is successful" in res.data


def test_non_existent_route(client: Any) -> None:
    """Test getting non-existant page."""
    res = client.get("/")
    assert res.status_code == 404
    assert b"The requested URL was not found on the server" in res.data


def test_graphql_get(client: FlaskClient) -> None:
    """Test graphql playground is returned."""
    res = client.get("/graphql")
    assert res.status_code == 200
    assert b"GraphQL Playground" in res.data


def patch_is_google_token_valid(mocker: MockerFixture, validToken: str) -> None:
    """Patch is_google_token_valid for testing."""
    mocker.patch(
        "src.api.is_google_token_valid",
        side_effect=(
            lambda x: (None, True)
            if x == validToken
            else (AppError(ErrorCode.INVALID_AUDIENCE_GOOGLE_TOKEN, "error"), False)
        ),
    )


def patch_add_google_user(mocker: MockerFixture, validToken: str, user: User) -> None:
    """Patch User.add_google_user for testing."""
    mocker.patch(
        "src.api.User.add_google_user",
        side_effect=(
            lambda x: (None, user)
            if x == validToken
            else (AppError(ErrorCode.GOOGLE_API_ERROR, "error"), None)
        ),
    )


def patch_lookup_user(mocker: MockerFixture, user: User, validId: str) -> None:
    """Patch User.lookup_user for testing."""
    mocker.patch(
        "src.api.User.lookup_user",
        side_effect=(lambda x: user if x == validId else None),
    )


CSFR_HEADERS = {"X-Requested-With": "XmlHttpRequest"}


def test_log_in_happy(client: FlaskClient, mocker: MockerFixture) -> None:
    """Test loggin in happy route."""
    # not logged in
    res = client.get("/isLoggedIn")
    json_response = cast(IsLoggedInResponse, res.get_json())
    assert not json_response["isLoggedIn"]

    # log in
    myId = "someId"
    myToken = "someToken"
    myUser = User()
    patch_is_google_token_valid(mocker, myToken)
    patch_add_google_user(mocker, myToken, myUser)
    patch_lookup_user(mocker, myUser, myId)
    setattr(myUser, "get_id", Mock(return_value=myId))

    res2 = client.post("/login", headers=CSFR_HEADERS, json={"access_token": myToken})
    json_response2 = cast(LoginResponse, res2.get_json())
    assert json_response2["isLoggedIn"]

    # check logged in
    res3 = client.get("/isLoggedIn")
    json_response3 = cast(IsLoggedInResponse, res3.get_json())
    assert json_response3["isLoggedIn"]


def test_log_in_invalid_token(client: FlaskClient, mocker: MockerFixture) -> None:
    """Test logging in with invalid token."""
    # log in
    myToken = "someToken"
    patch_is_google_token_valid(mocker, myToken)

    res = client.post(
        "/login", headers=CSFR_HEADERS, json={"access_token": myToken + "x"}
    )
    json_response = cast(LoginResponse, res.get_json())
    assert not json_response["isLoggedIn"]
    assert json_response["error"] is not None
    assert json_response["error"]["status_code"] == "INVALID_AUDIENCE_GOOGLE_TOKEN"

    # check logged in
    res2 = client.get("/isLoggedIn")
    json_response2 = cast(IsLoggedInResponse, res2.get_json())
    assert not json_response2["isLoggedIn"]


def test_log_in_get_user_info_failure(
    client: FlaskClient, mocker: MockerFixture
) -> None:
    """Test logging in with invalid token."""
    # log in
    myToken = "someToken"
    patch_is_google_token_valid(mocker, myToken)
    patch_add_google_user(mocker, myToken + "x", User())

    res = client.post("/login", headers=CSFR_HEADERS, json={"access_token": myToken})
    json_response = cast(LoginResponse, res.get_json())
    assert not json_response["isLoggedIn"]
    assert json_response["error"] is not None
    assert json_response["error"]["status_code"] == "GOOGLE_API_ERROR"

    # check logged in
    res2 = client.get("/isLoggedIn")
    json_response2 = cast(IsLoggedInResponse, res2.get_json())
    assert not json_response2["isLoggedIn"]


def test_log_in_csrf_failure(client: FlaskClient) -> None:
    """Test post request without proper headers results in 403."""
    res = client.post("/login", json={"access_token": "token"})
    assert res.status_code == 403
