"""GraphQL Ariadne resolver functions."""
# 'annotations' import needs to return enclosing type:
# https://www.python.org/dev/peps/pep-0563/
from __future__ import annotations

from typing import Any, List

from ariadne import MutationType, QueryType, ScalarType
from ariadne.types import GraphQLResolveInfo  # type: ignore
from bson.objectid import ObjectId
from flask_login import current_user
from src.gql.graphql import NewMatesInput
from src.model.family import Family
from src.model.mate import Mate
from src.model.user import User

oid_scalar = ScalarType("oid")


@oid_scalar.serializer
def serialize_oid(id: ObjectId) -> str:
    """
    Convert all MongoDB ObjectID into str.

    Otherwise, objects cannot be returned via JSON serialization.
    Returns str form of the id
    """
    return str(id)


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
        family_error, family = Family.add_new_family("Unassigned", 365)
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
