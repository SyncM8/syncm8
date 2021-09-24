"""Test the user model."""

from typing import Dict, Generator

import pytest
from mongoengine import connect, disconnect
from pytest_mock import MockerFixture
from src.model.user import User

userAlbert = {
    "given_name": "albert",
    "email": "albert@google.com",
    "id": "albertId",
    "picture": "albert-pic.com",
}
userNikola = {
    "given_name": "nikola",
    "email": "nikola@google.com",
    "id": "nikolaId",
    "picture": "nikola-pic.com",
}


@pytest.fixture
def db_connection() -> Generator[None, None, None]:
    """Connect to a mock mongodb instance."""
    connect("mongoenginetest", host="mongomock://localhost")
    yield None
    disconnect()


def assert_user_in_db(oid: str, name: str) -> None:
    """Call lookup_user with given oid and assert name is correct."""
    search_user = User.lookup_user(oid)
    assert search_user is not None
    assert search_user.first_name == name


def add_mock_user(mocker: MockerFixture, user_info: Dict[str, str]) -> User:
    """Add user to the mock db."""
    mocker.patch("src.model.user.get_user_info", return_value=(None, user_info))
    error, user = User.add_google_user("someToken")
    assert error is None
    assert user is not None
    assert user.first_name == user_info["given_name"]
    return user


def test_add_new_user(db_connection: None, mocker: MockerFixture) -> None:
    """Test simple case of single call to add google user."""
    user = add_mock_user(mocker, userAlbert)

    # check if in db - based on oid
    assert_user_in_db(user.id, userAlbert["given_name"])

    # check if in db - based on google id
    search_google_user = User.lookup_google_user("albertId")
    assert search_google_user is not None
    assert search_google_user.first_name == userAlbert["given_name"]


def test_add_two_users(db_connection: None, mocker: MockerFixture) -> None:
    """Test two different calls to add google user."""
    albert = add_mock_user(mocker, userAlbert)
    nikola = add_mock_user(mocker, userNikola)

    # check if nikola and albert are in db
    assert_user_in_db(albert.id, userAlbert["given_name"])
    assert_user_in_db(nikola.id, userNikola["given_name"])


def test_call_add_twice(db_connection: None, mocker: MockerFixture) -> None:
    """Test two calls to add user using same info."""
    albert = add_mock_user(mocker, userAlbert)
    albert2 = add_mock_user(mocker, userAlbert)

    assert_user_in_db(albert.id, userAlbert["given_name"])

    assert albert.id == albert2.id


def test_google_lookup_empty(db_connection: None) -> None:
    """Test call to lookup google user with empty db."""
    user = User.lookup_google_user("albertId")
    assert user is None


def test_user_lookup_empty(db_connection: None) -> None:
    """Test call to lookup user with empty db."""
    user = User.lookup_user("someId")
    assert user is None


def test_get_id(db_connection: None, mocker: MockerFixture) -> None:
    """Test get_id gets proper id."""
    albert = add_mock_user(mocker, userAlbert)
    assert str(albert.id) == albert.get_id()
