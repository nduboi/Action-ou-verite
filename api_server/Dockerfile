FROM node:latest
WORKDIR /app_api
COPY . /app_api
RUN npm install
EXPOSE 8080
CMD [ "node", "server.js" ]