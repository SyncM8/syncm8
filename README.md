![Backend Tests](https://github.com/SyncM8/syncm8/actions/workflows/backendCI.yml/badge.svg)
![Frontend Tests](https://github.com/SyncM8/syncm8/actions/workflows/frontendCI.yml/badge.svg)
![pre-commit](https://github.com/SyncM8/syncm8/actions/workflows/pre-commit.yml/badge.svg)
![CodeQL](https://github.com/SyncM8/syncm8/actions/workflows/codeql-analysis.yml/badge.svg)
![Pr Title Convention](https://github.com/SyncM8/syncm8/actions/workflows/prTitle.yml/badge.svg)
![Heartbeat](https://github.com/SyncM8/syncm8/actions/workflows/heartbeat.yml/badge.svg)
![Deploy](https://github.com/SyncM8/syncm8/actions/workflows/CD.yml/badge.svg)
![Dev Image Build](https://github.com/SyncM8/syncm8/actions/workflows/devDockerBuild.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---
## Dev Setup

1. Install Latest [Docker](https://docs.docker.com/get-docker/)
2. Install Latest [Node/npm](https://nodejs.org/en/download/)
3. Set up the git hooks.
```shell
bin/dev setup
```
4. Start python and mongo containers.
```shell
bin/dev up
```
5. Install python dependencies in the container. (You will need to do this every time new python dependencies are added.)
```shell
bin/dev py-req
```
6.  Install Client dependencies. (You will need to do this every time new npm dependencies are added.)
```shell
bin/dev client-req
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
bin/dev pytest [args]
```
2. Run Client Tests.
```shell
bin/dev jstest [files]
```
3. Run linters. ( Runs full suite of linters - this is automatically done before `git push` and again by a github action during CI.)
```shell
bin/dev check
```
