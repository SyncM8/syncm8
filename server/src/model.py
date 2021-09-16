from typing import List
from uuid import uuid4

from ariadne import MutationType, QueryType


class Coffee:
    """Coffee class for testing."""

    def __init__(self, size: str, name: str, coffee_type: str):
        """Initialize Coffee object."""
        self.size = size
        self.name = name
        self.type = coffee_type
        self.id = uuid4()


query = QueryType()
mutation = MutationType()

orders: List = []


@query.field("orders")
def resolve_orders(_, info):
    """Query fn."""
    return orders


@mutation.field("orderCoffee")
def resolve_order_coffee(_, info, size, name, type):
    """Mutation fn."""
    newOrder = Coffee(size, name, type)
    orders.append(newOrder)
    return newOrder
