FROM python:3.8

EXPOSE 5000

# Setup env
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIPENV_VENV_IN_PROJECT 1
ENV FLASK_APP 'server:app'


# give everything to the worker
WORKDIR /home/worker/app/server/

RUN pip install pipenv


ENV PATH /home/worker/app/server/.venv/bin:$PATH


ENTRYPOINT ["pipenv", "run", "flask", "run", "--host", "0.0.0.0"]
