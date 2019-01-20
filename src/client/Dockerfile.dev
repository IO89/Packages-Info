# Using node version 10 with alpine
FROM node:10-alpine
# Install tini
RUN apk add --update tini
# App  listens port 8080
EXPOSE 8080
WORKDIR /packages/frontend
# Copy package.json
COPY package*.json ./
# Copy everything from current dir to Packages dir
COPY . .
# npm install
RUN npm install && npm run tsc
# Start container with command tini --npm start
CMD ["tini","--","npm","start"]