"""
GraphQL related python types, other than MongoDB models.

Keep in sync with schema.graphql (also with graphql.ts)
"""
# 'annotations' import needs to return enclosing type:
# https://www.python.org/dev/peps/pep-0563/
from __future__ import annotations

from typing import TypedDict


class NewMatesInput(TypedDict):
    """New Mate Input class passed from client."""

    name: str
    lastSynced: str  # date gets converted to str
