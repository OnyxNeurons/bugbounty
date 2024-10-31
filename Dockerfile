FROM node:18-alpine AS base
WORKDIR /backend

FROM base AS frontend
WORKDIR /frontend

COPY frontend/package.json ./
COPY frontend/yarn.lock ./

RUN yarn
COPY frontend /frontend
RUN yarn build

FROM base AS backend
WORKDIR /backend

COPY backend/package.json ./
COPY backend/yarn.lock ./

RUN yarn 

COPY backend /backend
RUN yarn build

FROM backend AS production

COPY --from=frontend /frontend/dist /frontend
COPY --from=backend /backend/dist /backend/dist
COPY --from=backend /backend/node_modules /backend/node_modules
COPY manifest.json /manifest.json

CMD ["node", "dist/main.js"]

