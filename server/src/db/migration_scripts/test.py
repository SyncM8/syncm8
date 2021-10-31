"""Sample migration."""

from src.model.user import User


def run() -> None:
    """Print all Users."""
    print(User.objects)
