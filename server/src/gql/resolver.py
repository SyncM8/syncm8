"""GraphQL Ariadne resolver functions."""
from datetime import datetime
from typing import Any, List

from ariadne import MutationType, QueryType, ScalarType
from ariadne.types import GraphQLResolveInfo  # type: ignore
from bson.objectid import ObjectId
from flask_login import current_user
from src.gql.graphql import MateAssignmentInput, NewMatesInput
from src.model.family import Family
from src.model.mate import Mate
from src.model.user import User
from src.types.new_family import UNASSIGNED_FAMILY

oid_scalar = ScalarType("oid")


@oid_scalar.serializer
def serialize_oid(id: ObjectId) -> str:
    """
    Convert all MongoDB ObjectID into str.

    Otherwise, objects cannot be returned via JSON serialization.
    Returns str form of the id
    """
    return str(id)


date_scalar = ScalarType("Date")


@date_scalar.serializer
def serialize_date(date: datetime) -> str:
    """
    Convert datetime to ISO-8601 format.

    Note: date.isoformat() doesn't include timezone automatically.
    Z at the end specifies UTC timezone.
    """
    return f"{date.isoformat()}Z"


query = QueryType()
mutation = MutationType()


@mutation.field("addNewMates")
def resolve_add_new_mates(
    obj: Any, info: GraphQLResolveInfo, mates: List[NewMatesInput]
) -> List[Mate]:
    """Add new mates to the user's unassigned family."""
    user = User.lookup_user(current_user.get_id())
    if not user:
        raise Exception("User not found")

    family = Family.lookup_family(user.unassigned_family_id)
    if not family:
        family_error, family = Family.add_new_family(
            UNASSIGNED_FAMILY.name, UNASSIGNED_FAMILY.sync_interval_days
        )
        if family_error or not family:
            raise Exception("Family not found and cannot be created")
        user.unassigned_family_id = family.id
        user.save()

    error, new_mates = Mate.bulk_insert_new_mates(mates)
    if error:
        raise Exception(error.error_details)
    if not new_mates:
        raise Exception("New mates not created")

    family.mate_ids += [new_mate.id for new_mate in new_mates]
    family.save()
    return new_mates


@mutation.field("assignMates")
def resolve_assign_mates(
    obj: Any, info: GraphQLResolveInfo, mateAssignments: List[MateAssignmentInput]
) -> List[str]:
    """
    Assign mates to specified families.

    Args:
    ----
        obj: GraphQL
        info: GraphQLInfo
        mateAssignments: mate assignment specification

    Returns ids of updated mates

    """
    user = User.lookup_user(current_user.get_id())
    if not user:
        raise Exception("User not found")

    moved_mates: List[str] = []

    families_map = {str(family.id): family for family in user.families}
    for mate_assignment in mateAssignments:
        mate_id = mate_assignment["mateId"]
        from_family_id = mate_assignment["fromFamilyId"]
        to_family_id = mate_assignment["toFamilyId"]
        if from_family_id not in families_map:
            raise Exception(f"fromFamilyId {from_family_id} does not exist")
        if to_family_id not in families_map:
            raise Exception(f"toFamilyId {to_family_id} does not exist")

        from_family_mates = [
            str(mate.id) for mate in families_map[from_family_id].mate_ids
        ]
        if mate_id not in from_family_mates:
            raise Exception(f"mateId {mate_id} does not exist")

        idx = next(
            idx
            for idx in range(len(from_family_mates))
            if str(from_family_mates[idx]) == mate_id
        )
        mate_ref = families_map[from_family_id].mate_ids.pop(idx)
        families_map[to_family_id].mate_ids.append(mate_ref)
        moved_mates.append(str(mate_ref.id))

    for family in families_map.values():
        family.save()

    return moved_mates


@query.field("getUserData")
def resolve_get_user_data(obj: Any, info: GraphQLResolveInfo) -> User:
    """Get User object."""
    user = User.lookup_user(current_user.get_id())
    if not user:
        raise Exception("User not found")
    return user
