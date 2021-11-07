"""Sample migration."""

from src.model.user import User


def run() -> None:
    """Print all Users."""
    print(f"Number of users in DB: {len(User.objects)}")
