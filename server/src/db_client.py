import os

from pymongo import MongoClient

uri = os.environ.get("MONGO_URI")
client = MongoClient(uri)
db = client["main"]
users = db["users"]

cursor = users.find({})
for document in cursor:
        print(document)
