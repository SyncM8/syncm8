"""Test the resolver functions."""

from unittest import mock

import pytest
from bson.objectid import ObjectId
from pytest_mock import MockerFixture
from src.gql.resolver import resolve_add_new_mates, serialize_oid


def test_serialize_oid() -> None:
    """Test serialization from ObjectId to str."""
    id_str = "61748ebb121b296baa21efc0"
    id_obj = ObjectId(id_str)
    res = serialize_oid(id_obj)
    assert isinstance(res, str)
    assert res == id_str


@pytest.mark.usefixtures("db_connection")
@mock.patch("flask_login.utils._get_user", lambda: mock.MagicMock())
def test_resolve_add_new_mates_happy(mocker: MockerFixture) -> None:
    """Add new mates and ensure that they are added to the unassigned family."""
    names = [{"name": "Yumi"}, {"name": "Ruby"}]
    testFamilyId = "TestFamilyId"

    user = mock.MagicMock()
    mocker.patch("src.gql.resolver.User.lookup_user", lambda x: user)

    family = mock.MagicMock()
    family.mate_ids = []
    family.id = testFamilyId
    mocker.patch("src.gql.resolver.Family.add_new_family", lambda x, y: (None, family))

    mates = resolve_add_new_mates(None, None, names)

    assert mates
    assert len(mates) == len(names)
    assert mates[0].name == names[0]["name"]
    assert mates[1].name == names[1]["name"]
    assert len(family.mate_ids) == 2
    assert family.mate_ids[0] == mates[0].id
    assert family.mate_ids[1] == mates[1].id
    assert user.unassigned_family_id == testFamilyId


@pytest.mark.usefixtures("db_connection")
@mock.patch("flask_login.utils._get_user", lambda: mock.MagicMock())
def test_resolve_add_new_mates_no_user() -> None:
    """Raises error when current user cannot be found."""
    with pytest.raises(Exception, match="User not found"):
        resolve_add_new_mates(None, None, [])


@pytest.mark.usefixtures("db_connection")
@mock.patch("flask_login.utils._get_user", lambda: mock.MagicMock())
@mock.patch("src.gql.resolver.User.lookup_user", lambda x: mock.MagicMock())
@mock.patch("src.gql.resolver.Family.add_new_family", lambda x, y: (Exception(), None))
def test_resolve_add_new_mates_no_family() -> None:
    """Raises error when failed to add a new family."""
    with pytest.raises(Exception, match="Family not found"):
        resolve_add_new_mates(None, None, [])


@pytest.mark.usefixtures("db_connection")
@mock.patch("flask_login.utils._get_user", lambda: mock.MagicMock())
@mock.patch("src.gql.resolver.User.lookup_user", lambda x: mock.MagicMock())
@mock.patch("src.gql.resolver.Family.lookup_family", lambda x: mock.MagicMock())
@mock.patch("src.gql.resolver.Mate.bulk_insert_new_mates", lambda x: (None, None))
def test_resolve_add_new_mates_fail_bulk() -> None:
    """Raises error when failed to bulk insert new mates."""
    with pytest.raises(Exception, match="New mates not created"):
        resolve_add_new_mates(None, None, [])
