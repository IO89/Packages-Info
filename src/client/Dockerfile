# Using node version 10 with alpine
FROM node:10-alpine as builder
# Install tini
RUN apk add --update tini
WORKDIR /packages/frontend
# Copy package.json
COPY package*.json ./
# Copy everything from current dir to Packages dir
COPY . .
# npm install
RUN npm install && npm run tsc
# Start container with command tini --npm start
CMD ["tini","--","npm","run","build"]

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /packages/frontend/build /usr/share/nginx/html