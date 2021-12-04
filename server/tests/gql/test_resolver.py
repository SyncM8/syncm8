"""Test the resolver functions."""

from typing import List
from unittest import mock

import pytest
from bson.objectid import ObjectId
from dateutil.parser import isoparse  # type: ignore
from pytest_mock import MockerFixture
from src.gql.graphql import MateAssignmentInput, NewMatesInput
from src.gql.resolver import (
    resolve_add_new_mates,
    resolve_assign_mates,
    resolve_get_user_data,
    serialize_date,
    serialize_oid,
)
from src.model.family import Family
from src.model.mate import Mate
from src.model.user import User

mateSteve: NewMatesInput = {"name": "Steve", "lastSynced": "2021-10-23T20:42:06.112Z"}
mateJobs: NewMatesInput = {"name": "Jobs", "lastSynced": "2021-09-19T22:11:24.931Z"}
mateSatya: NewMatesInput = {"name": "Satya", "lastSynced": "2021-09-19T22:11:24.931Z"}
mateNadella: NewMatesInput = {
    "name": "Nadella",
    "lastSynced": "2021-09-19T22:11:24.931Z",
}
mateBuzz: NewMatesInput = {"name": "Buzz", "lastSynced": "2021-09-19T22:11:24.931Z"}


def test_serialize_oid() -> None:
    """Test serialization from ObjectId to str."""
    id_str = "61748ebb121b296baa21efc0"
    id_obj = ObjectId(id_str)
    res = serialize_oid(id_obj)
    assert isinstance(res, str)
    assert res == id_str


def test_serialize_date() -> None:
    """Test serialization from datetime to str."""
    iso_str = "2021-11-17T23:40:37.347Z"  # new Date().toISOString() in JS
    iso_res = "2021-11-17T23:40:37.347000+00:00Z"
    date = isoparse(iso_str)
    res = serialize_date(date)
    assert isinstance(res, str)
    assert res == iso_res


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


@pytest.mark.usefixtures("db_connection")
@mock.patch("flask_login.utils._get_user", lambda: mock.MagicMock())
def test_resolve_get_user_data(mocker: MockerFixture) -> None:
    """Get user data."""
    user = mock.MagicMock()
    mocker.patch("src.gql.resolver.User.lookup_user", lambda x: user)

    res = resolve_get_user_data(None, None)
    assert res == user


@pytest.mark.usefixtures("db_connection")
@mock.patch("flask_login.utils._get_user", lambda: mock.MagicMock())
def test_resolve_get_user_data_fail() -> None:
    """Raises error when failed to get user."""
    with pytest.raises(Exception, match="User not found"):
        resolve_get_user_data(None, None)


@pytest.mark.usefixtures("db_connection")
@mock.patch("flask_login.utils._get_user", lambda: mock.MagicMock())
def test_resolve_assign_mates(mocker: MockerFixture) -> None:
    """Assign mates to different family."""
    error, mates = Mate.bulk_insert_new_mates(
        [mateSteve, mateJobs, mateSatya, mateNadella, mateBuzz]
    )
    assert not error and mates
    steve, jobs, satya, nadella, buzz = mates

    unassigned_error, unassigned_family = Family.add_new_family("unassigned_test", 1)
    apple_error, family_apple = Family.add_new_family("Apple", 2)
    msft_error, family_msft = Family.add_new_family("Microsoft", 3)

    assert not unassigned_error and unassigned_family
    assert not apple_error and family_apple
    assert not msft_error and family_msft

    unassigned_family.mate_ids = mates
    unassigned_family.save()

    user = User(
        first_name="Turing",
        email="me@computer.com",
        unassigned_family_id=unassigned_family.id,
        family_ids=[unassigned_family.id, family_apple.id, family_msft.id],
    )
    user.save()

    assignment_input: List[MateAssignmentInput] = [
        {
            "mateId": str(steve.id),
            "fromFamilyId": str(unassigned_family.id),
            "toFamilyId": str(family_apple.id),
        },
        {
            "mateId": str(jobs.id),
            "fromFamilyId": str(unassigned_family.id),
            "toFamilyId": str(family_apple.id),
        },
        {
            "mateId": str(satya.id),
            "fromFamilyId": str(unassigned_family.id),
            "toFamilyId": str(family_msft.id),
        },
        {
            "mateId": str(nadella.id),
            "fromFamilyId": str(unassigned_family.id),
            "toFamilyId": str(family_msft.id),
        },
    ]

    mocker.patch("src.gql.resolver.User.lookup_user", lambda x: user)

    moved_mates = resolve_assign_mates(None, None, assignment_input)
    assert len(moved_mates) == len(assignment_input)
    assert moved_mates == [str(steve.id), str(jobs.id), str(satya.id), str(nadella.id)]

    user.reload()
    for family in user.families:
        if family.name == "unassigned_test":
            assert len(family.mates) == 1
            assert family.mates[0].id == buzz.id
        elif family.name == "Apple":
            assert len(family.mates) == 2
            mate_ids = sorted([mate.id for mate in family.mates])
            assert mate_ids == sorted([steve.id, jobs.id])
        elif family.name == "Microsoft":
            assert len(family.mates) == 2
            mate_ids = sorted([mate.id for mate in family.mates])
            assert mate_ids == sorted([satya.id, nadella.id])
        else:
            assert False, f"Found unrecognized family: {family.name}"

    wrong_mate_input: List[MateAssignmentInput] = [
        {
            "mateId": "nonexistant_mate_id",
            "fromFamilyId": str(unassigned_family.id),
            "toFamilyId": str(family_apple.id),
        }
    ]
    with pytest.raises(Exception, match="mateId nonexistant_mate_id does not exist"):
        resolve_assign_mates(None, None, wrong_mate_input)

    wrong_from_family_input: List[MateAssignmentInput] = [
        {
            "mateId": str(steve.id),
            "fromFamilyId": "nonexistant_from_family_id",
            "toFamilyId": str(family_apple.id),
        }
    ]
    with pytest.raises(
        Exception, match="fromFamilyId nonexistant_from_family_id does not exist"
    ):
        resolve_assign_mates(None, None, wrong_from_family_input)

    wrong_to_family_input: List[MateAssignmentInput] = [
        {
            "mateId": str(steve.id),
            "fromFamilyId": str(unassigned_family.id),
            "toFamilyId": "nonexistant_to_family_id",
        }
    ]
    with pytest.raises(
        Exception, match="toFamilyId nonexistant_to_family_id does not exist"
    ):
        resolve_assign_mates(None, None, wrong_to_family_input)
