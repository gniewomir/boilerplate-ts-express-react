FROM node:14.11.0-buster-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:14.11.0-buster-slim AS distribution

WORKDIR /app

COPY --from=builder --chown=node:node /app/jest.config.js ./jest.config.js

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/package-lock.json ./package-lock.json
RUN npm ci --production
COPY --from=builder --chown=node:node /app/dist ./dist

ENV RUNNING_IN_CONTAINER=true

USER node

EXPOSE 9000

CMD [ "node", "dist/api.js" ]