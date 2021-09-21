"""Syncm8 Api."""
import os
from http import HTTPStatus
from typing import Any, Callable, Optional, TypeVar, cast

import flask_login
from ariadne import gql, graphql_sync, load_schema_from_path, make_executable_schema
from ariadne.constants import PLAYGROUND_HTML
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, login_required, login_user

from .clients.db import connect_db
from .clients.google import is_google_token_valid
from .gql import mutation, query
from .model.user import User

connect_db()


app = Flask(__name__)
app.secret_key = os.environ.get("APP_SECRET_KEY")
CORS(
    app,
    origins=["http://localhost:3000", "https://syncm8.com"],
    supports_credentials=True,
)

F = TypeVar("F", bound=Callable[..., Any])


def csrf_protection(fn: F) -> F:
    """Decorate mutationg functions to add CSRF protection."""

    def protected(*args: Any, **kwargs: Any) -> Any:
        if "X-Requested-With" in request.headers:
            return fn(*args, **kwargs)
        else:
            return ("X-Requested-With header missing", HTTPStatus.FORBIDDEN)

    return cast(F, protected)


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"


@login_manager.user_loader
def load_user(user_id: str) -> Optional[User]:
    """
    Look up a user by their user ID.

    Called by flask-login to get the current user from the session.
    Returns None if the user ID isn't valid.
    """
    return User.lookup_user(user_id)


type_defs = gql(load_schema_from_path("../schema.graphql"))
schema = make_executable_schema(type_defs, query, mutation)


@app.route("/test", methods=["GET"])
def test() -> Any:
    """Serve test html."""
    return "<h1 style='color:blue'>The test is successful.</h1>"


@csrf_protection
@app.route("/login", methods=["Post"])
def login() -> Any:
    """
    Lgoin to app using google token.

    If no user with specified google id exists, preforms sign up.
    """
    googleToken = request.json.get("access_token")  # type: ignore
    error, is_valid = is_google_token_valid(googleToken)

    if not error and is_valid:
        error, new_user = User.add_google_user(googleToken)
        if not error:
            login_user(new_user, remember=True)
            return {"isLoggedIn": True}

    return {"isLoggedIn": False, "error": error.get_dict_repr() if error else "None"}


@login_required
@app.route("/isLoggedIn", methods=["GET"])
def is_logged_in() -> Any:
    """Return whether the user is logged in."""
    return {"isLoggedIn": flask_login.current_user.is_authenticated}


@app.route("/graphql", methods=["GET"])
def graphql_playground() -> Any:
    """Serve GraphQL playground."""
    return PLAYGROUND_HTML, 200


@csrf_protection
@app.route("/graphql", methods=["POST"])
def graphql_server() -> Any:
    """Receive and execute GraphQL commands."""
    data = request.get_json()

    success, result = graphql_sync(schema, data, context_value=request, debug=app.debug)

    status_code = 200 if success else 400
    return jsonify(result), status_code
