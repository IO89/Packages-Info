# Using node version 10 with alpine
FROM node:10-alpine
EXPOSE 5000
#Install tini and nodemon
RUN apk add --update tini && npm i -g nodemon
WORKDIR  /packages/backend
COPY package*.json ./
# Copy everything from current dir to packages dir
COPY . .
#Npm install and typescript compiler
RUN npm i && npm run tsc
#Launch server in wathc mode
CMD ["tini","--","npm","run","start"]
