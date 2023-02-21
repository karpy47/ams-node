# Docker install

This Docker setup creates an environment for AMS software system using three containers:

* db (postgres)
* server (node/express)
* client (react)

These Docker containers could be used in production but would likely require some adjustments.

## Installation

**Step 1:** Install Docker for your system: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/). The Desktop-versions adds a GUI that makes things easier, otherwise use the command line version.

**Step 2:** Open a command shell and change working directory to `ams/docker` where you'll find all Docker and other needed config files that are briefly explained below.

* `docker-compose.yml` - the compose file that defines the full environment
* `dockerfile-db` - a regular Dockerfile to build a postgres container
* `dockerfile-server` - a regular Dockerfile to build a node container
* `dockerfile-client` - a regular Dockerfile to build a react container

**Step 3:** Create a local config file `.env` in the `ams/server` directory and edit as needed. Currently all needed settings for the docker development environment  are set in `docker-compose.yml`, thus the `.env` file may then be empty/ignored.

**Step 4:** Now the fun part (hopefully). From the `ams/docker` directory, run:

    docker compose up

Enjoy as images are pulled and containers are started.

**Step 5:** Initialize databases

Open a CLI-window to the *running* server container to setup and initalize the database. (In Docker Desktop for Windows you can easily do that from the control panel.) Run this Docker command from a shell:

    docker exec -it ams-server /bin/bash

Once inside a shell, run these commands to setup dev and test databases and seed them with some randomized data.

    To be added later

**Step 6:** Verify connectivity to the server from the outside (eg using a curl command in a shell).

    curl http://localhost:3001/api/ping

If everything works you should get a HTTP 200:OK response, indicating that the server and the database is running.

## Future upgrades or downgrades of databases

This docker install also creates a test database with a postfix "-test" using the same credentials as for the original database.

To apply migrations for both databases run these commands in a new shell.

    TBD
    export DATABASE_URL_ORG=$DATABASE_URL
    TBD
    DATABASE_URL=$DATABASE_URL_TEST
    TBD
    DATABASE_URL=$DATABASE_URL_ORG

These commands also exists in a script at `/code/docker/db-upgrade.sh`. Simply open a pipenv shell and run `./db-upgrade`.

## TEST notes

## Docker notes

Some notes about storage:

* Source-files (pulled from Git) are mounted into the source container and any changes in the local file system are immediately available inside the container. (NOT TRUE YET)

* Database data files are stored in a mounted volume that is handled by Docker.

To later rebuild images after changing the Docker files, run:

    docker compose up --build

Som useful commands to see volumes, inspect and to remove them:

    docker volume ls
    docker volume inspect [volume name]
    docker volume rm [volume name]

## Other notes
