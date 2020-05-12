# Gunnesgard  [![Build Status](https://travis-ci.com/magnusfahlin/gunnesgard_se.svg?branch=master)](https://travis-ci.com/magnusfahlin/gunnesgard_se)

#####  How to build and debug:
Prerequisite:
1. Docker Desktop
2. VS code 

Build:
`docker-compose up` lanches the containers for development
Debug:
Open Visual studio code and debug the cleint or backend from there

##### Testing
Client: in `/client` run `npm test`
Backend: in `/server` run `npm test`

##### CI
The plan is to run it in travis and deploy it.
There are production docker files for all containers
 
##### Migration of the database

1. Uncomment the mariaDb and PhpMyAdmin part of the  `docker-compose.yaml`

2. Export the old MariaDb.

3. Import it in the PhpMyAdmin running in the container.

4. Run the migration tool in this project
