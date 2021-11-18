"""GraphQL Ariadne resolver functions."""
from datetime import datetime
from typing import Any, List

from ariadne import MutationType, QueryType, ScalarType
from ariadne.types import GraphQLResolveInfo  # type: ignore
from bson.objectid import ObjectId
from flask_login import current_user
from src.gql.graphql import NewAssignmentInput, NewMatesInput
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


@mutation.field("assignMatesToFamilies")
def resolve_assign_mates_to_families(
    obj: Any, info: GraphQLResolveInfo, newAssignments: List[NewAssignmentInput]
) -> User:
    """
    Assign mates to specified families.

    Args:
    ----
        obj: GraphQL
        info: GraphQLInfo
        newAssignments: each item of NewAssignmentInput contains
            - familyId
            - list of id's of mates to be assigned to that family

    Returns updated User

    """
    user = User.lookup_user(current_user.get_id())
    if not user:
        raise Exception("User not found")

    unassigned_family = user.unassigned_family
    unassigned_id = str(unassigned_family.id)
    unassigned_mate_ids = set([str(mate.id) for mate in unassigned_family.mate_ids])
    family_ids = set([str(family.id) for family in user.family_ids])
    for input in newAssignments:
        for mate_id in input["mateIds"]:
            if mate_id not in unassigned_mate_ids:
                raise Exception(f"Mate id {mate_id} is not unassigned")
        if input["familyId"] not in family_ids:
            raise Exception(f"Family id {input['familyId']} does not exist")

    families_map = {str(family.id): family for family in user.families}
    for input in newAssignments:
        for mate_id in input["mateIds"]:
            idx = next(
                idx
                for idx in range(len(families_map[unassigned_id].mate_ids))
                if str(families_map[unassigned_id].mate_ids[idx].id) == mate_id
            )
            mate_ref = families_map[unassigned_id].mate_ids.pop(idx)
            families_map[input["familyId"]].mate_ids.append(mate_ref)

    for family in families_map.values():
        family.save()

    user.reload()
    return user


@query.field("getUserData")
def resolve_get_user_data(obj: Any, info: GraphQLResolveInfo) -> List[Mate]:
    """Get User object."""
    user = User.lookup_user(current_user.get_id())
    if not user:
        raise Exception("User not found")
    return user
