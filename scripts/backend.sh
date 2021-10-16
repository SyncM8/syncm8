#!bash
cd server
source dev.env
pipenv install --dev
pipenv run python server.py
