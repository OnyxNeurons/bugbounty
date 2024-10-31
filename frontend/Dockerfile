FROM node:18-alpine AS development

WORKDIR /frontend

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "run", "dev"]