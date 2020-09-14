# Setup

Setup development environment 

```shell script
cp .env.dist .env
cp services/postgres/.env.dist services/postgres/.env
cp services/api/.env.dist services/api/.env
docker network create web
docker-compose -f docker-compose.yml -f docker-compose.development.yml up --build --force-recreate --remove-orphans
docker-compose exec api npm run db:drop || true
docker-compose exec api npm run db:migrate
curl localhost:8000/api/status

cd services/api
npm ci
npm run test
```

# Todo
* Add a way of enforcing response shape
* Add more structured way of loading fixtures
* Introduce authorization service and permissions 
    * add refresh tokens with longer lifetime which will allow only obtaining new token
    * revoking any user token should also revoke all refresh tokens
    * consider how to log out from other browser tabs/devices ref: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
* Remove expired and blacklisted tokens from database 

# Links
* Structure: https://softwareontheroad.com/ideal-nodejs-project-structure/
* ORM: https://github.com/typeorm/typeorm
* Testing: https://wanago.io/2019/02/04/typescript-express-testing/
