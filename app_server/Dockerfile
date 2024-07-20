FROM node:latest
WORKDIR /app_app
COPY . /app_app
RUN npm install
EXPOSE 80
CMD [ "node", "server.cjs" ]