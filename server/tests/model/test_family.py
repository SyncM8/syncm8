"""Test the family model."""

from typing import Generator
from unittest import mock

import pytest
from mongoengine import connect, disconnect
from src.model.family import Family
from src.utils.error import ErrorCode


@pytest.fixture
def db_connection() -> Generator[None, None, None]:
    """Connect to a mock mongodb instance."""
    disconnect()
    connect("mongoenginetest", host="mongomock://localhost")
    yield None
    disconnect()


def test_add_new_family(db_connection: None) -> None:
    """Test adding a family."""
    name = "TestFamily"
    interval = 42
    error, family = Family.add_new_family(name, interval)
    assert not error
    assert family
    assert family.name == name
    assert family.sync_interval_days == interval
    assert family.mate_ids == []


def test_lookup_family(db_connection: None) -> None:
    """Test looking up family by id."""
    error, family = Family.add_new_family("", 1)
    assert not error and family
    id = str(family.id)
    assert family == Family.lookup_family(id)


def test_lookup_nonexistent_family(db_connection: None) -> None:
    """Test looking up nonexistent family."""
    family = Family.lookup_family("nonexistent_id")
    assert not family


@mock.patch("src.model.family.Family", Exception())
def test_add_new_family_fail(db_connection: None) -> None:
    """Test mongo error is caught."""
    error, family = Family.add_new_family("", 1)
    assert not family
    assert error
    assert error.status_code == ErrorCode.MONGO_ERROR
    assert error.error_details == "Mongo error when adding new family"
