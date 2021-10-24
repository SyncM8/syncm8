# do not change this import statement, .ini file expects exactly this
from src.api import app

if __name__ == "__main__":
    app.run(debug=True)
