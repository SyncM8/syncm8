"""MigrationScript Runner."""
import importlib.util
import os
from datetime import datetime

from mongoengine import Document, connect
from mongoengine.fields import DateTimeField, StringField


class MigrationScriptRun(Document):
    """Record of successful MigrationScript run."""

    time_stamp = DateTimeField(required=True, default=datetime.utcnow())
    name = StringField()
    meta = {"collection": "migration_scripts", "strict": False}

    def __init__(self, name: str) -> None:
        """Create and save the migration script run."""
        super().__init__(name=name)
        self.save()


def connect_db() -> None:
    """Connect mongoengine to db."""
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


if __name__ == "__main__":
    connect_db()
    already_run = [script.name for script in MigrationScriptRun.objects]
    migration_dir_name = os.path.join(os.path.dirname(__file__), "migration_scripts")
    present_scripts = os.listdir(migration_dir_name)

    to_run = [
        name
        for name in present_scripts
        if name not in already_run and not name == "__init__.py"
    ]

    for name in to_run:
        print("Starting run for ", name)
        script = importlib.import_module(".migration_scripts." + name[0:-3], "src.db")
        script.run()  # type: ignore
        print("Run completed for ", name)
        MigrationScriptRun(name)
        print("Saved ", name)
