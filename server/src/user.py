# from flask_login import UserMixin

# class User(UserMixin):
#     pass


# # A simple user manager.  A real world application would implement the same
# # interface but using a database as a backing store.  Note that this
# # implementation will behave unexpectedly if the user contacts multiple
# # instances of the application since it is using an in-memory store.
# class UserManager(object):
#     """
#     Simple user manager class.
#     Replace with something that talks to your database instead.
#     """

#     def __init__(self):
#         self.known_users = {}

#     def add_or_update_google_user(self, google_subscriber_id, name, profile_pic):
#         """Add or update user profile info."""
#         if google_subscriber_id in self.known_users:
#             self.known_users[google_subscriber_id].update(name, profile_pic)
#         else:
#             self.known_users[google_subscriber_id] = User(
#                 google_subscriber_id, name, profile_pic
#             )
#         return self.known_users[google_subscriber_id]

#     def lookup_user(self, google_subscriber_id):
#         """Lookup user by ID.  Returns User object."""
#         return self.known_users.get(google_subscriber_id)
