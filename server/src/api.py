from ariadne import gql, graphql_sync, load_schema_from_path, make_executable_schema
from ariadne.constants import PLAYGROUND_HTML
from flask import Flask, jsonify, request
from flask_login import LoginManager

from .model import mutation, query

# from .user import UserManager

type_defs = gql(load_schema_from_path("../schema.graphql"))
schema = make_executable_schema(type_defs, query, mutation)

app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)

# user_manager = UserManager()

# # The user loader looks up a user by their user ID, and is called by
# # flask-login to get the current user from the session.  Return None
# # if the user ID isn't valid.
# @login_manager.user_loader
# def user_loader(user_id):
#     return user_manager.lookup_user(user_id)


@app.route("/test")
def hello():
    """Serve test html."""
    return "<h1 style='color:blue'>The test is successful.</h1>"


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
