FROM python:3.8

EXPOSE 5000

# Setup env
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIPENV_VENV_IN_PROJECT 1
ENV FLASK_APP 'server:app'

# cli args to copy over host machine user
ARG user_id
ARG group_id

# give everything to the worker
WORKDIR /home/worker/app/server/
RUN chown -R $user_id:$group_id /home/worker

# create worker and set as the user
RUN groupadd -o -g $group_id worker
RUN useradd --no-create-home -o -u $user_id -g $group_id worker
USER worker

# install pipenv as worker
ENV PATH /home/worker/.local/bin:$PATH
RUN pip install --user pipenv

# Install python dependencies into /.venv
COPY --chown=$user_id:$group_id ./server/Pipfile .
COPY --chown=$user_id:$group_id ./server/Pipfile.lock .
RUN pipenv install --dev

ENV PATH /home/worker/app/server/.venv/bin:$PATH

RUN echo hi

ENTRYPOINT ["pipenv", "run", "flask", "run", "--host", "0.0.0.0"]
