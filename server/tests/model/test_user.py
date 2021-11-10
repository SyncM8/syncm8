"""Test the user model."""

from typing import Dict

import pytest
from pytest_mock import MockerFixture
from src.model.family import Family
from src.model.user import User
from src.types.new_family import STARTER_FAMILIES, UNASSIGNED_FAMILY

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


@pytest.mark.usefixtures("db_connection")
def test_add_new_user(mocker: MockerFixture) -> None:
    """Test simple case of single call to add google user."""
    user = add_mock_user(mocker, userAlbert)

    # check if in db - based on oid
    assert_user_in_db(user.id, userAlbert["given_name"])

    # check if in db - based on google id
    search_google_user = User.lookup_google_user("albertId")
    assert search_google_user is not None
    assert search_google_user.first_name == userAlbert["given_name"]


@pytest.mark.usefixtures("db_connection")
def test_add_two_users(mocker: MockerFixture) -> None:
    """Test two different calls to add google user."""
    albert = add_mock_user(mocker, userAlbert)
    nikola = add_mock_user(mocker, userNikola)

    # check if nikola and albert are in db
    assert_user_in_db(albert.id, userAlbert["given_name"])
    assert_user_in_db(nikola.id, userNikola["given_name"])


@pytest.mark.usefixtures("db_connection")
def test_call_add_twice(mocker: MockerFixture) -> None:
    """Test two calls to add user using same info."""
    albert = add_mock_user(mocker, userAlbert)
    albert2 = add_mock_user(mocker, userAlbert)

    assert_user_in_db(albert.id, userAlbert["given_name"])

    assert albert.id == albert2.id


@pytest.mark.usefixtures("db_connection")
def test_google_lookup_empty() -> None:
    """Test call to lookup google user with empty db."""
    user = User.lookup_google_user("albertId")
    assert user is None


@pytest.mark.usefixtures("db_connection")
def test_user_lookup_empty() -> None:
    """Test call to lookup user with empty db."""
    user = User.lookup_user("someId")
    assert user is None


@pytest.mark.usefixtures("db_connection")
def test_get_id(mocker: MockerFixture) -> None:
    """Test get_id gets proper id."""
    albert = add_mock_user(mocker, userAlbert)
    assert str(albert.id) == albert.get_id()


@pytest.mark.usefixtures("db_connection")
def test_unassigned_family_id(mocker: MockerFixture) -> None:
    """Test unassigned_family_id was created and populated."""
    user = add_mock_user(mocker, userAlbert)
    family = user.unassigned_family_id
    assert family
    assert family.get_id() == str(family.id)
    assert family.name == UNASSIGNED_FAMILY.name
    assert family.sync_interval_days == UNASSIGNED_FAMILY.sync_interval_days


@pytest.mark.usefixtures("db_connection")
def test_starter_family_ids(mocker: MockerFixture) -> None:
    """Test family_ids is populated with starter and unassigned families."""
    user = add_mock_user(mocker, userAlbert)
    family_ids = user.family_ids
    assert family_ids
    assert len(family_ids) == len(STARTER_FAMILIES) + 1  # account for unassigned family

    found_unassigned_family = False
    for family_ref in family_ids:
        family = family_ref.fetch()
        assert family.get_id() == str(family.id)

        if family == user.unassigned_family_id:
            found_unassigned_family = True
            continue

        starter_family = next(
            (
                starter
                for starter in STARTER_FAMILIES
                if starter.name == family.name
                and starter.sync_interval_days == family.sync_interval_days
            ),
            None,
        )
        assert starter_family
    assert found_unassigned_family
