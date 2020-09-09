# setup

```shell script
cp services/postgres/.env.dist .env
cp services/api/.env.dist .env
cp services/web/.env.dist .env
docker network create web
docker-compose up --build --force-recreate --remove-orphans
docker-compose exec api npm run db:drop || true
docker-compose exec api npm run db:migrate
```

# Links
* Structure: https://softwareontheroad.com/ideal-nodejs-project-structure/
* ORM: https://github.com/typeorm/typeorm
* Testing: https://wanago.io/2019/02/04/typescript-express-testing/