from ariadne import QueryType, MutationType
from uuid import uuid4
from typing import List

class Coffee:
   def __init__(self, size: str, name: str, coffee_type: str):
       self.size = size
       self.name = name
       self.type = coffee_type
       self.id = uuid4()

query = QueryType()
mutation = MutationType()

orders: List = []

@query.field("orders")
def resolve_orders(_, info):
    return orders

@mutation.field("orderCoffee")
def resolve_order_coffee(_, info, size, name, type):
    newOrder = Coffee(size, name, type)
    orders.append(newOrder)
    return newOrder