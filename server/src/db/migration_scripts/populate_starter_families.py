"""Migration for populating family_ids with starter families in users."""

from typing import List

from bson.objectid import ObjectId
from src.model.family import Family
from src.model.user import User
from src.types.new_family import STARTER_FAMILIES


def run() -> None:
    """Get all users without family_ids and populate with a starter families."""
    users = User.objects(family_ids__exists=False)
    for user in users:
        family_ids: List[ObjectId] = [user.unassigned_family_id]
        for starter_family in STARTER_FAMILIES:
            family_error, family = Family.add_new_family(
                starter_family.name, starter_family.sync_interval_days
            )
            if family_error or not family:
                raise Exception(
                    f"Family {starter_family} cannot be created for user: {user}"
                )
            family_ids.append(family.id)
        user.family_ids = family_ids
        user.save()
