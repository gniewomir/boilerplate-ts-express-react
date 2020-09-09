FROM node:14.9.0-buster AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:14.9.0-buster AS distribution

WORKDIR /app

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/.env.dist ./.env

USER node

EXPOSE 9000

CMD [ "node", "dist/api.js" ]