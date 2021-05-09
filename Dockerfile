FROM node:12-alpine

WORKDIR /usr/app

COPY package*.json /usr/app

RUN npm install

COPY src /usr/app/src

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]