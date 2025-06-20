# dockerfile/be2.Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY be2/package*.json ./
RUN npm install

COPY be2 ./
RUN npm run build

EXPOSE 50051
CMD ["node", "dist/index.js"]
