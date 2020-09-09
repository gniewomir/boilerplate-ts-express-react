# setup

```shell script
cp services/postgres/.env.dist services/postgres/.env
cp services/api/.env.dist services/api/.env
cp services/web/.env.dist services/web/.env
docker network create web
docker-compose up --build --force-recreate --remove-orphans
docker-compose exec api npm run db:drop || true
docker-compose exec api npm run db:migrate
```

# Links
* Structure: https://softwareontheroad.com/ideal-nodejs-project-structure/
* ORM: https://github.com/typeorm/typeorm
* Testing: https://wanago.io/2019/02/04/typescript-express-testing/