from flask_login import UserMixin


class User:
    """Simple User class that stores ID"""

    def __init__(self, id, google_id):
        self.id = google_id
        self.google_id = google_id
        self.is_authenticated = True
        self.is_active = True
        self.is_anonymous = False

    def get_id(self):
        return self.id


# A simple user manager.  A real world application would implement the same
# interface but using a database as a backing store.  Note that this
# implementation will behave unexpectedly if the user contacts multiple
# instances of the application since it is using an in-memory store.
class UserManager:
    """
    Simple user manager class.
    Replace with something that talks to your database instead.
    """

    def __init__(self):
        self.known_users = {}
        self.uuid = 0

    def add_google_user(self, google_id):
        """Add user and return the user."""
        newUser = User(self.uuid, google_id)
        self.known_users[self.uuid] = newUser
        self.uuid += 1
        return newUser

    def lookup_user(self, id):
        """Lookup user by ID.  Returns User object."""
        print("lookup")
        return self.known_users.get(id)
