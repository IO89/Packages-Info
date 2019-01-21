# Using node version 10 with alpine
FROM node:10-alpine as builder
WORKDIR /packages/frontend
# Copy package.json
COPY package*.json ./
# Copy everything from current dir to Packages dir
COPY . .
# npm install
RUN npm install && npm run tsc
RUN npm run build


FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /packages/frontend/build /usr/share/nginx/html