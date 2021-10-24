"""Test the mate model."""

from typing import Generator, List
from unittest import mock

import pytest
from mongoengine import connect, disconnect
from pytest_mock import MockerFixture
from src.gql.graphql import NewMatesInput
from src.model.mate import Mate
from src.utils.error import AppError, ErrorCode

mateSteve: NewMatesInput = {"name": "Steve", "lastSynced": "2021-10-23T20:42:06.112Z"}
mateJobs: NewMatesInput = {"name": "Jobs", "lastSynced": "2021-09-19T22:11:24.931Z"}


@pytest.fixture
def db_connection() -> Generator[None, None, None]:
    """Connect to a mock mongodb instance."""
    disconnect()
    connect("mongoenginetest", host="mongomock://localhost")
    yield None
    disconnect()


def test_bulk_insert_new_mates(db_connection: None) -> None:
    """Test bulk inserting mates."""
    new_mates: List[NewMatesInput] = [mateSteve, mateJobs]
    error, mates = Mate.bulk_insert_new_mates(new_mates)
    assert not error
    assert mates
    assert len(mates) == len(new_mates)
    assert mates[0].name == mateSteve["name"]
    assert mates[1].name == mateJobs["name"]
    assert len(mates[0].sync_ids) == 1
    assert len(mates[1].sync_ids) == 1


def test_bulk_insert_no_last_synced(db_connection: None) -> None:
    """Test bulk inserting with no lastSynced."""
    new_mates: List[NewMatesInput] = [{"name": "Steve"}, mateJobs]  # type: ignore
    error, mates = Mate.bulk_insert_new_mates(new_mates)
    assert not error
    assert mates
    assert len(mates) == 2
    assert len(mates[0].sync_ids) == 1


def test_bulk_insert_empty(db_connection: None) -> None:
    """Test inserting empty bulk."""
    error, mates = Mate.bulk_insert_new_mates([])
    assert not error
    assert mates == []


def test_bulk_insert_fail_sync(db_connection: None, mocker: MockerFixture) -> None:
    """Test that sync error bubbles up when it fails."""
    new_mates: List[NewMatesInput] = [mateSteve]
    error_msg = "test sync fail"
    sync_error = AppError(ErrorCode.MONGO_ERROR, error_msg)
    mocker.patch(
        "src.model.mate.Sync.add_new_sync", side_effect=lambda x: (sync_error, None)
    )
    error, mates = Mate.bulk_insert_new_mates(new_mates)

    assert not mates
    assert error
    assert error.error_details == error_msg


@mock.patch("src.model.mate.Mate", Exception())
def test_bulk_insert_fail(db_connection: None) -> None:
    """Test mongo error is caught."""
    new_mates: List[NewMatesInput] = [mateSteve]
    error, mates = Mate.bulk_insert_new_mates(new_mates)

    assert not mates
    assert error
    assert error.status_code == ErrorCode.MONGO_ERROR
    assert error.error_details == "Mongo error when bulk adding new mates"
