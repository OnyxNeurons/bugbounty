FROM node:18-alpine AS development

WORKDIR /backend

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma:generate

CMD ["yarn", "start:dev"]

FROM node:18-alpine AS build

WORKDIR /backend

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --immutable --immutable-cache --check-cache

COPY . .

RUN yarn prisma:generate
RUN yarn prisma:push
RUN yarn build

FROM build AS production

WORKDIR /backend

COPY --from=build /backend/dist ./dist
COPY --from=build /backend/node_modules ./node_modules

CMD ["node", "dist/main.js"]
