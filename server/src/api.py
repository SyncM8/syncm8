import os

import flask_login
from ariadne import gql, graphql_sync, load_schema_from_path, make_executable_schema
from ariadne.constants import PLAYGROUND_HTML
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, login_required, login_user

from .google_client import verify_google_token
from .model import mutation, query
from .user import UserManager

app = Flask(__name__)
app.secret_key = os.environ.get("APP_SECRET_KEY")
CORS(
    app,
    origins=["http://localhost:3000", "https://syncm8.com"],
    supports_credentials=True,
)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"

user_manager = UserManager()

# The user loader looks up a user by their user ID, and is called by
# flask-login to get the current user from the session.  Return None
# if the user ID isn't valid.
@login_manager.user_loader
def load_user(user_id):
    print(user_id)
    # import pdb; pdb.set_trace()
    return user_manager.lookup_user(user_id)


type_defs = gql(load_schema_from_path("../schema.graphql"))
schema = make_executable_schema(type_defs, query, mutation)


@app.route("/test")
def hello():
    """Serve test html."""
    return "<h1 style='color:blue'>The test is successful.</h1>"


@app.route("/login", methods=["Post"])
def login():
    googleToken = request.json.get("access_token")
    isValid, google_id = verify_google_token(googleToken)

    if isValid:
        new_user = user_manager.add_google_user(google_id)
        print(new_user.get_id())
        print(login_user(new_user, remember=True))
        return {"isLoggedIn": True}
    else:
        return {"isLoggedIn": False}


@login_required
@app.route("/isLoggedIn", methods=["GET"])
def is_logged_in():
    return {"isLoggedIn": flask_login.current_user.get_id()}


@app.route("/graphql", methods=["GET"])
def graphql_playground():
    """Serve GraphQL playground."""
    return PLAYGROUND_HTML, 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    """Receive GraphQL commands."""
    data = request.get_json()

    success, result = graphql_sync(schema, data, context_value=request, debug=app.debug)

    status_code = 200 if success else 400
    return jsonify(result), status_code
