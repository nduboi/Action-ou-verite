FROM node:latest
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install -g node-dev
EXPOSE 80
CMD [ "node-dev", "server.js" ]