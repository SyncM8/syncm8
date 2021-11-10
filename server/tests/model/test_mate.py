"""Test the mate model."""

from typing import List
from unittest import mock
from datetime import datetime

import pytest
from pytest_mock import MockerFixture
from src.model.sync import Sync
from src.gql.graphql import NewMatesInput
from src.model.mate import Mate
from src.utils.error import AppError, ErrorCode

mateSteve: NewMatesInput = {"name": "Steve", "lastSynced": "2021-10-23T20:42:06.112Z"}
mateJobs: NewMatesInput = {"name": "Jobs", "lastSynced": "2021-09-19T22:11:24.931Z"}


@pytest.mark.usefixtures("db_connection")
def test_bulk_insert_new_mates() -> None:
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


@pytest.mark.usefixtures("db_connection")
def test_bulk_insert_no_last_synced() -> None:
    """Test bulk inserting with no lastSynced."""
    new_mates: List[NewMatesInput] = [{"name": "Steve"}, mateJobs]  # type: ignore
    error, mates = Mate.bulk_insert_new_mates(new_mates)
    assert not error
    assert mates
    assert len(mates) == 2
    assert len(mates[0].sync_ids) == 1


@pytest.mark.usefixtures("db_connection")
def test_bulk_insert_empty() -> None:
    """Test inserting empty bulk."""
    error, mates = Mate.bulk_insert_new_mates([])
    assert not error
    assert mates == []


@pytest.mark.usefixtures("db_connection")
def test_bulk_insert_fail_sync(mocker: MockerFixture) -> None:
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


@pytest.mark.usefixtures("db_connection")
@mock.patch("src.model.mate.Mate", Exception())
def test_bulk_insert_fail() -> None:
    """Test mongo error is caught."""
    new_mates: List[NewMatesInput] = [mateSteve]
    error, mates = Mate.bulk_insert_new_mates(new_mates)

    assert not mates
    assert error
    assert error.status_code == ErrorCode.MONGO_ERROR
    assert error.error_details == "Mongo error when bulk adding new mates"


@pytest.mark.usefixtures("db_connection")
def test_mate_properties() -> None:
    """Test LazyReferenceField properties."""
    new_mates: List[NewMatesInput] = [mateSteve, mateJobs]
    error, mates = Mate.bulk_insert_new_mates(new_mates)
    assert mates
    mate = mates[0]

    sync0_err, sync0 = Sync.add_new_sync(datetime.now(), "zero", "details")
    sync1_err, sync1 = Sync.add_new_sync(datetime.now(), "one", "details")
    assert sync0 and sync1

    mate.sync_ids = [sync0.id, sync1.id]
    mate.save()
    assert len(mate.syncs) == len(mate.sync_ids)
    assert type(mate.syncs[0]) == Sync
