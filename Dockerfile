FROM python:3.8 as base

EXPOSE 5000

# Setup env
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIPENV_VENV_IN_PROJECT 1
ENV FLASK_APP 'server:app'
ENV PATH /home/worker/app/.venv/bin:$PATH
ENV SETUPTOOLS_USE_DISTUTILS stdlib

RUN pip install pipenv


FROM base as dev

ENV FLASK_ENV development
ENV PRE_COMMIT_HOME /home/worker/app/.pre-commit
ENV APP_SECRET_KEY b\xaeX\xe6x5\x02/\xcb\xad\xa3\x8f\x97D\xab\xbe/!\xf2\xe4H\x1b\xdb\xdcv
ENV GOOGLE_CLIENT_ID 711095332609-rfg1tm319vhrs7i1tf1ubclo99srmc08.apps.googleusercontent.com
ENV MONGO_HOST mongodb
ENV MONGO_USER user
ENV MONGO_PASSWORD pass

ENV MYSQL_URL mysql+pymysql://user:password@syncm8_mysql/main

WORKDIR /home/worker/app/
CMD cd server && pipenv run flask run --host 0.0.0.0


FROM base as prod
# Most env is loaded through AWS during deploy
ENV GOOGLE_CLIENT_ID 711095332609-5dun7k2lp70do0kqjrbe69u0pri5d5i0.apps.googleusercontent.com
ENV FLASK_ENV production

WORKDIR /home/worker/app
COPY Pipfile ./
COPY Pipfile.lock ./
RUN pipenv install --deploy
COPY server ./server/

WORKDIR /home/worker/app/server
ENTRYPOINT pipenv run uwsgi --ini syncm8.ini
