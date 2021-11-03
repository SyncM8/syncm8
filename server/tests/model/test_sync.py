"""Test the sync model."""

from datetime import datetime
from unittest import mock

import pytest
from dateutil.parser import isoparse  # type: ignore
from src.model.sync import Sync
from src.utils.error import ErrorCode


@pytest.mark.usefixtures("db_connection")
def test_add_new_sync() -> None:
    """Test adding a sync."""
    timestamp = isoparse("2021-10-23T20:42:06.112Z")
    title = "test title"
    details = "test details here longer than title"
    error, sync = Sync.add_new_sync(timestamp, title, details)
    assert not error
    assert sync
    assert isinstance(sync.timestamp, datetime)
    assert sync.timestamp == timestamp
    assert sync.get_id()
    assert isinstance(sync.get_id(), str)
    assert sync.title == title
    assert sync.details == details


@pytest.mark.usefixtures("db_connection")
def test_add_sync_with_no_details() -> None:
    """Test adding a sync with no details."""
    timestamp = isoparse("2021-10-23T20:42:06.112Z")
    error, sync = Sync.add_new_sync(timestamp)
    assert not error
    assert sync
    assert sync.title == ""
    assert sync.details == ""


@pytest.mark.usefixtures("db_connection")
@mock.patch("src.model.sync.Sync", Exception())
def test_add_sync_fail() -> None:
    """Test mongo error is caught."""
    timestamp = isoparse("2021-10-23T20:42:06.112Z")
    error, sync = Sync.add_new_sync(timestamp)
    assert not sync
    assert error
    assert error.status_code == ErrorCode.MONGO_ERROR
    assert error.error_details == "Mongo error when adding new sync"
