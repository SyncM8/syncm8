import os
import tempfile
from typing import Any

import pytest
from src.api import app


@pytest.fixture
def client() -> Any:
    """Get client api app for testing."""
    db_fd, db_path = tempfile.mkstemp()
    # app = create_app({'TESTING': True, 'DATABASE': db_path})

    with app.test_client() as client:
        yield client

    os.close(db_fd)
    os.unlink(db_path)


def test_test(client: Any) -> Any:
    """Test that test endpoint is working."""
    res = client.get("/test")
    assert res.status_code == 200
    assert b"The test is successful" in res.data


def test_hello(client: Any) -> Any:
    """Test getting non-existant page."""
    res = client.get("/")
    assert res.status_code == 404
    assert b"The requested URL was not found on the server" in res.data


def test_graphql(client: Any) -> Any:
    """Test graphql playground is returned."""
    res = client.get("/graphql")
    assert res.status_code == 200
    assert b"html" in res.data
