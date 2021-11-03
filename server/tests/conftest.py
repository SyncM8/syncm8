"""Provide fixtures for all tests."""

from typing import Generator

import pytest
from mongoengine import connect, disconnect


@pytest.fixture(scope="function")
def db_connection() -> Generator[None, None, None]:
    """Connect to a mock mongodb instance."""
    disconnect()
    connect("mongoenginetest", host="mongomock://localhost")
    yield None
    disconnect()
