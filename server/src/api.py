"""Syncm8 Api."""
import os
from http import HTTPStatus
from typing import Any, Callable, Optional, TypedDict, TypeVar, cast

from ariadne import gql, graphql_sync, load_schema_from_path, make_executable_schema
from ariadne.constants import PLAYGROUND_HTML
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, current_user, login_user

from .clients.db import connect_db
from .clients.google import is_google_token_valid
from .gql import mutation, query
from .model.user import User
from .utils.error import AppErrorDictType

app = Flask(__name__)

if (
    os.environ.get("FLASK_ENV") == "production"
    or os.environ.get("FLASK_ENV") == "development"
):
    connect_db(app)

app.secret_key = os.environ.get("APP_SECRET_KEY")
CORS(
    app,
    origins=["http://localhost:3000", "https://syncm8.com", "https://www.syncm8.com"],
    supports_credentials=True,
)

F = TypeVar("F", bound=Callable[..., Any])


def csrf_protection(fn: F) -> F:
    """Decorate mutating functions to add CSRF protection."""

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


class LoginResponse(TypedDict):
    """Response for the isLoggedIn route."""

    isLoggedIn: bool
    error: Optional[AppErrorDictType]


@app.route("/login", methods=["Post"])
@csrf_protection
def login() -> LoginResponse:
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
            return {"isLoggedIn": True, "error": None}

    return {"isLoggedIn": False, "error": error.get_dict_repr() if error else None}


class IsLoggedInResponse(TypedDict):
    """Response for the isLoggedIn route."""

    isLoggedIn: bool


@app.route("/isLoggedIn", methods=["GET"])
def is_logged_in() -> IsLoggedInResponse:
    """Return whether the user is logged in."""
    return {"isLoggedIn": current_user.is_authenticated}


@app.route("/graphql", methods=["GET"])
def graphql_playground() -> Any:
    """Serve GraphQL playground."""
    return PLAYGROUND_HTML, 200


@app.route("/graphql", methods=["POST"])
def graphql_server() -> Any:
    """Receive and execute GraphQL commands."""
    data = request.get_json()

    success, result = graphql_sync(schema, data, context_value=request, debug=app.debug)

    status_code = 200 if success else 400
    return jsonify(result), status_code
