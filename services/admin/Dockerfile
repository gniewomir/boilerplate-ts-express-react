FROM node:14.9.0-buster as builder

WORKDIR /app/server

COPY server/package*.json ./
COPY server/ts*.json ./
RUN npm ci
COPY server ./
RUN npm run build

WORKDIR /app/client

COPY client/package*.json ./
COPY client/ts*.json ./
RUN npm ci
COPY client ./
RUN npm run build

FROM node:14.9.0-buster AS distribution

WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --production
COPY --from=builder --chown=node:node /app/server/dist ./dist

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci --production
COPY --from=builder --chown=node:node /app/client/build ./build

ENV RUNNING_IN_CONTAINER=true

WORKDIR /app/client

USER node

EXPOSE 3000

CMD [ "node", "/app/server/dist/server.js" ]
