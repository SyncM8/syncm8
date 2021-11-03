"""
GraphQL related python types, other than MongoDB models.

Keep in sync with schema.graphql (also with graphql.ts)
"""
from typing import TypedDict


class NewMatesInput(TypedDict):
    """New Mate Input class passed from client."""

    name: str
    lastSynced: str  # date gets converted to str
