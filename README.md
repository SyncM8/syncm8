![Backend Tests](https://github.com/SyncM8/syncm8/actions/workflows/backendCI.yml/badge.svg)
![Frontend Tests](https://github.com/SyncM8/syncm8/actions/workflows/frontendCI.yml/badge.svg)
![pre-commit](https://github.com/SyncM8/syncm8/actions/workflows/pre-commit.yml/badge.svg)
![CodeQL](https://github.com/SyncM8/syncm8/actions/workflows/codeql-analysis.yml/badge.svg)
![Pr Title Convention](https://github.com/SyncM8/syncm8/actions/workflows/prTitle.yml/badge.svg)
![Heartbeat](https://github.com/SyncM8/syncm8/actions/workflows/heartbeat.yml/badge.svg)
![Deploy](https://github.com/SyncM8/syncm8/actions/workflows/CD.yml/badge.svg)
![Dev Image Build](https://github.com/SyncM8/syncm8/actions/workflows/devDockerBuild.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/SyncM8/syncm8.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/SyncM8/syncm8/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/SyncM8/syncm8.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/SyncM8/syncm8/context:javascript)
[![Language grade: Python](https://img.shields.io/lgtm/grade/python/g/SyncM8/syncm8.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/SyncM8/syncm8/context:python)

---
## Dev Setup

1. Install Latest [Docker](https://docs.docker.com/get-docker/)
2. Install Latest [Node/npm](https://nodejs.org/en/download/)
3. Install [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
4. Set up the git hooks.
```shell
bin/dev setup
```
5. Grab the dev.env file from the notion secrets page and place it in the top level of your project.
6. Install python dependencies in the container. (You will need to do this every time new python dependencies are added.)
```shell
bin/dev py-req
```
7.  Install Client dependencies. (You will need to do this every time new npm dependencies are added.)
```shell
bin/dev client-req
```
8.  Install pre-commit.
``` shell
bin/dev sudo pre-commit install-hooks
sudo chown -R $(id -u):$(id -g) .pre-commit
```
---
## Running the App

1. Start Containers and start the Flask web server
```shell
bin/dev backend
```
2. Start the Client
```shell
bin/dev client
```
3. Navigate to app: http://localhost:3000

---
## Testing

1. Run Backend Tests. All args are passed transparently to [pytest](https://docs.pytest.org/en/6.2.x/getting-started.html)
```shell
bin/dev run pytest [args]
```
2. Run Client Tests.
```shell
bin/dev jstest [files]
```
3. Run linters. (Runs full suite of linters on committed files - this is automatically done before `git push` and again by a github action during CI.)
```shell
bin/dev check
```
## Updating

1. Occasionally, newer versions of the devobx container will be made. Your invocation of `bin/dev backend` will likely pull it, but you can manually do so by running.
```shell
bin/dev pull
```

## Fix Python Location for vscode

```shell
bin/dev run bash
rm /home/worker/app/.venv/bin/python3.8 &&
cp /usr/local/bin/python3.8 /home/worker/app/.venv/bin/python3.8 &&
ln -fs /home/worker/app/.venv/bin/python3.8 /home/worker/app/.venv/bin/python
```
