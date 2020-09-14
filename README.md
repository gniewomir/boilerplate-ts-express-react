# Setup

## Project setup

install: https://github.com/nvm-sh/nvm

```shell script
# ensure correct version of node is available locally
# all package.json scripts should work both on host and in container 
nvm install v14.9.0
nvm use v14.9.0

# ensure public network is available
docker network create web | true

# in project root directory
cp .env.dist .env
cp services/postgres/.env.dist services/postgres/.env
cp services/api/.env.dist services/api/.env
cp services/admin/.env.dist services/admin/.env
```

## App development setup

```shell script
# in project root directory
docker-compose -f docker-compose.yml -f docker-compose.development.yml up -d --build --force-recreate --remove-orphans
docker-compose exec api npm run db:drop || true
docker-compose exec api npm run db:migrate

# ensure we are good to go

# should return "OK" 
curl localhost:8000/api/status
# should return html or just go to localhost:8000 in your browser   
curl localhost:8000
# test api
docker-compose exec api npm run test

docker-compose logs -f

```

NOTE:
- api should recompile and restart on changes
- admin has hot module reload enabled 

## App not-development setup
 
```shell script
# in project root directory
docker-compose -f docker-compose.yml -f docker-compose.not-development.yml up -d --build --force-recreate --remove-orphans
docker-compose exec api ./node_modules/typeorm/cli.js --config dist/application/config/typeorm.cli.js schema:drop
docker-compose exec api ./node_modules/typeorm/cli.js --config dist/application/config/typeorm.cli.js migration:run

# ensure we are good to go

# should return "OK" 
curl localhost:8000/api/status
# should return html or just go to localhost:8000 in your browser   
curl localhost:8000
# test api
docker-compose exec api npm run test:nobuild

docker-compose logs -f
```

## Postman

```
# fixtures
curl --location --request POST 'http://localhost:8000/api/user' \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data-raw '{
            "name": "Gniewomir Świechowski",
            "email": "gniewomir.swiechowski@gmail.com",
            "password": "kNcy64fWbcAGBPY3"
     }'
```

# Todo
* Project: Postman collection with automatic request authentication
* Project: Changelog
* Api: Timestamps for entities (updated/created)
* Api: Add a way of enforcing response shape
* Api: Add a way of loading fixtures
* Api: Introduce authorization service and permissions 
    * add refresh tokens with longer lifetime which will allow only obtaining a new token
    * revoking any user token should also revoke all refresh tokens
    * consider how to log out from other browser tabs/devices ref: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
* Api: Remove expired and blacklisted tokens from database
* Api: Queue?
    * mailer
    * email confirmation
* Api: CQRS?

# Links
* Structure: https://softwareontheroad.com/ideal-nodejs-project-structure/
* DI: https://www.npmjs.com/package/typedi
* ORM: https://github.com/typeorm/typeorm
* Testing: https://wanago.io/2019/02/04/typescript-express-testing/
