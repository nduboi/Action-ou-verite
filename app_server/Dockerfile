FROM node:latest
WORKDIR /app_app
COPY . /app_app
RUN npm ci
EXPOSE 80
CMD [ "node", "server.cjs" ]