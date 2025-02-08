FROM node:18-alpine
WORKDIR /app_api
COPY . /app_api
RUN npm ci
EXPOSE 8080
CMD ["node", "server.js" ]