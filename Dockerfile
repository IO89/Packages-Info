# Using node version 10 with alpine
FROM node:10-alpine
EXPOSE 5000
WORKDIR  /packages/backend
COPY package*.json ./
# Copy everything from current dir to packages dir
COPY . .
#Npm install and typescript compiler
RUN yarn && yarn run tsc
CMD ["yarn","run","start"]
