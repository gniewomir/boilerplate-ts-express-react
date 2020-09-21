This project started as a recruitment task, but it started to take shape of kind-off boilerplate/learning project, so I will treat it as one in near future. Improving it as my understanding of Type Script, layered architecture, CQRS and DDD grows. Maybe it will be of some use to someone, but for now only supported platform will be linux.    

# Setup

## Project setup

install: https://github.com/nvm-sh/nvm

```shell script
# ensure correct version of node is available locally
# all package.json scripts should work both on host and in container 
nvm install v14.9.0

# ensure public network is available
docker network create web | true

# in project root directory
cp .env.dist .env
cp services/postgres/.env.dist services/postgres/.env
cp services/api/.env.dist services/api/.env
cp services/admin/.env.dist services/admin/.env
cp services/admin/client/.env.dist services/admin/client/.env
```

## Development setup

```shell script
# in project root directory
docker-compose -f docker-compose.yml -f docker-compose.development.yml up -d --build --force-recreate --remove-orphans
docker-compose exec api npm run db:refresh
docker-compose exec api npm run db:testing:refresh

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

## Not-development setup
 
```shell script
# in project root directory
docker-compose -f docker-compose.yml -f docker-compose.not-development.yml up -d --build --force-recreate --remove-orphans
docker-compose exec api npm run db:notdev:refresh
docker-compose exec api npm run db:notdev:testing:refresh

# ensure we are good to go

# should return "OK" 
curl localhost:8000/api/status
# should return html or just go to localhost:8000 in your browser   
curl localhost:8000
# test api
docker-compose exec api npm run test:notdev

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
* Project: Postman collection with automatic request authentication as testing way
* Project: Changelog
* Project: What is the best way of sharing code (types?) between TS services?
* Project: SSR React app. 
* Api: Finish separating application layers, CQRS?
* Api: Timestamps for entities (updated/created)
* Api: Add a way of loading fixtures
* Api: Depend on token IAT claim and user logged out/logged in time instead blacklist?
* Api: Revoking any user token should also revoke all refresh tokens
* Api: To consider: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
* Api: Remove expired and blacklisted tokens from database
* Api: Queue?
    * mailer
    * email confirmation

# Links
* Structure: https://softwareontheroad.com/ideal-nodejs-project-structure/
* DI: https://www.npmjs.com/package/typedi
* ORM: https://github.com/typeorm/typeorm
* Testing: https://wanago.io/2019/02/04/typescript-express-testing/
