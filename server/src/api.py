import os

from ariadne import gql, graphql_sync, load_schema_from_path, make_executable_schema
from ariadne.constants import PLAYGROUND_HTML
from flask import Flask, jsonify, request, send_from_directory
from flask_login import LoginManager

from .model import mutation, query

type_defs = gql(load_schema_from_path("../schema.graphql"))
schema = make_executable_schema(type_defs, query, mutation)


static_dir = os.path.join("client", "build")

app = Flask(
    __name__,
    root_path=os.path.abspath(".."),
    static_folder=static_dir,
    static_url_path="",
)
app.config["REMEMBER_COOKIE_HTTPONLY"] = True

login_manager = LoginManager()
login_manager.init_app(app)


@app.route("/test")
def hello():
    """Serve test html."""
    return "<h1 style='color:blue'>The test is successful.</h1>"


@app.route("/")
def root():
    """Serve default index.html file."""
    return send_from_directory(static_dir, "index.html")


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


def get_app():
    """Return flask app."""
    return app
