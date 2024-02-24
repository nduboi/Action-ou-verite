FROM node:latest
WORKDIR /app_api
COPY . /app_api
RUN npm install
RUN npm install -g node-dev
EXPOSE 8080
CMD [ "node-dev", "server.js" ]