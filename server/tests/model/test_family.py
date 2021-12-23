"""Test the family model."""

from typing import List
from unittest import mock

import pytest
from mongoengine.base.datastructures import LazyReference
from src.gql.graphql import NewMatesInput
from src.model.family import Family
from src.model.mate import Mate
from src.model.user import User
from src.utils.error import ErrorCode
from tests.model.test_mate import mateJobs, mateSteve


@pytest.mark.usefixtures("db_connection")
def test_add_new_family() -> None:
    """Test adding a family."""
    name = "TestFamily"
    interval = 42
    error, family = Family.add_new_family(name, interval)
    assert not error
    assert family
    assert family.name == name
    assert family.sync_interval_days == interval
    assert family.mate_ids == []


@pytest.mark.usefixtures("db_connection")
def test_lookup_family() -> None:
    """Test looking up family by id."""
    error, family = Family.add_new_family("", 1)
    assert not error and family
    id = str(family.id)
    assert family == Family.lookup_family(id)


@pytest.mark.usefixtures("db_connection")
def test_lookup_family_ref() -> None:
    """Test looking up family by LazyReference."""
    error, family = Family.add_new_family("", 1)
    assert not error and family

    newUser = User(
        first_name="Charles",
        email="hodge@email.com",
        unassigned_family_id=family.id,
        family_ids=[family.id],
    )
    newUser.save()
    assert newUser
    assert isinstance(newUser.unassigned_family_id, LazyReference)
    family = Family.lookup_family(newUser.unassigned_family_id)
    assert family == newUser.unassigned_family_id
    assert family == newUser.unassigned_family_id.fetch()


@pytest.mark.usefixtures("db_connection")
def test_lookup_nonexistent_family() -> None:
    """Test looking up nonexistent family."""
    family = Family.lookup_family("nonexistent_id")
    assert not family


@pytest.mark.usefixtures("db_connection")
@mock.patch("src.model.family.Family", Exception())
def test_add_new_family_fail() -> None:
    """Test mongo error is caught."""
    error, family = Family.add_new_family("", 1)
    assert not family
    assert error
    assert error.status_code == ErrorCode.MONGO_ERROR
    assert error.error_details == "Mongo error when adding new family"


@pytest.mark.usefixtures("db_connection")
def test_family_properties() -> None:
    """Test LazyReferenceField properties."""
    new_mates: List[NewMatesInput] = [mateSteve, mateJobs]
    error, mates = Mate.bulk_insert_new_mates(new_mates)
    assert mates
    assert len(mates) == len(new_mates)

    error, family = Family.add_new_family("TestFamily", 42)
    assert family
    family.mate_ids = [mate.id for mate in mates]
    family.save()

    assert len(family.mate_ids) == len(mates)
    assert len(family.mates) == 2
    assert type(family.mates[0]) == Mate
    assert family.mates[0] == mates[0]
    assert family.mates[1] == mates[1]
