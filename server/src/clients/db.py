"""Client to connect mongoengine to the db."""
import os

from mongoengine import connect


def connect_db() -> None:
    """Connect mongoengine to db. Only needs to be called once per thread."""
    mongo_user = os.environ.get("MONGO_USER")
    mongo_password = os.environ.get("MONGO_PASSWORD")
    mongo_host = os.environ.get("MONGO_HOST")
    connect(
        db="main",
        username=mongo_user,
        password=mongo_password,
        host=mongo_host,
        w="majority",
    )