# Setup

Setup full development environment 

```shell script
cp .env.dist .env
cp services/postgres/.env.dist services/postgres/.env
cp services/api/.env.dist services/api/.env
docker network create web | true
cd services/api
npm ci
cd -
docker-compose -f docker-compose.yml -f docker-compose.development.yml up -d --build --force-recreate --remove-orphans
docker-compose exec api npm run db:drop || true
docker-compose exec api npm run db:migrate
docker-compose exec api npm run test

curl localhost:8000/api/status

docker-compose logs -f
```

Setup api testing environment (no watcher, no mounting local changes, no dev dependencies, no typescript)
 
```shell script
cp .env.dist .env
cp services/postgres/.env.dist services/postgres/.env
cp services/api/.env.dist services/api/.env
docker network create web | true
docker-compose -f docker-compose.yml -f docker-compose.not-development.yml up -d --build --force-recreate --remove-orphans
docker-compose exec api ./node_modules/typeorm/cli.js --config dist/application/config/typeorm.cli.js schema:drop
docker-compose exec api ./node_modules/typeorm/cli.js --config dist/application/config/typeorm.cli.js migration:run
docker-compose exec api npm run test

curl localhost:8000/api/status

docker-compose logs -f
```

# Todo
* Timestamps for entities (updated/created)
* Add a way of enforcing response shape
* Add a way of loading fixtures
* Introduce authorization service and permissions 
    * add refresh tokens with longer lifetime which will allow only obtaining a new token
    * revoking any user token should also revoke all refresh tokens
    * consider how to log out from other browser tabs/devices ref: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
* Remove expired and blacklisted tokens from database 

# Links
* Structure: https://softwareontheroad.com/ideal-nodejs-project-structure/
* DI: https://www.npmjs.com/package/typedi
* ORM: https://github.com/typeorm/typeorm
* Testing: https://wanago.io/2019/02/04/typescript-express-testing/
