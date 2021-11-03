"""Test the family model."""

from unittest import mock

import pytest
from src.model.family import Family
from src.utils.error import ErrorCode


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
