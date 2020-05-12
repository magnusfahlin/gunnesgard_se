FROM node:13.12.0-alpine

WORKDIR /app

COPY ./package.json ./
RUN yarn install
COPY . .
CMD ["npm", "run", "start"]