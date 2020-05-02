FROM node:alpine
RUN apk update && apk upgrade && apk add --no-cache git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci
COPY . .

RUN npm run build

EXPOSE 8081

CMD ["node", "./build/server.js"]