FROM node:latest
WORKDIR /app_api
COPY . /app_api
RUN npm ci
EXPOSE 8080
CMD ["npx", "node-dev", "server.js" ]