FROM node:latest
WORKDIR /app_app
COPY . /app_app
RUN npm install
RUN npm install -g node-dev
EXPOSE 80
CMD [ "node-dev", "server.cjs" ]