# setup

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
```

# Links
* Structure: https://softwareontheroad.com/ideal-nodejs-project-structure/
* ORM: https://github.com/typeorm/typeorm
* Testing: https://wanago.io/2019/02/04/typescript-express-testing/

