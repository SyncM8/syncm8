"""Migration for populating unassigned_family_id in users."""

from src.model.family import Family
from src.model.user import User


def run() -> None:
    """Get all users without unassigned_family_id and populate with a new family."""
    users = User.objects(unassigned_family_id__exists=False)
    for user in users:
        family_error, family = Family.add_new_family("Unassigned", 365)
        if family_error or not family:
            raise Exception(f"Family not found and cannot be created for user: {user}")
        user.unassigned_family_id = family.id
        user.save()
