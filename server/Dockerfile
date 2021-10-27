FROM python:3.8

# Expose ports
EXPOSE 5000

# Setup env
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIPENV_VENV_IN_PROJECT 1
ENV FLASK_APP 'server:app'

RUN pip install pipenv
RUN apt-get update && apt-get install -y --no-install-recommends gcc

WORKDIR /usr/src/app

# Install python dependencies in /.venv
COPY Pipfile .
COPY Pipfile.lock .
RUN pipenv install

ENV PATH /.venv/bin:$PATH

ENTRYPOINT ["pipenv", "run", "flask", "run", "--host", "0.0.0.0"]
