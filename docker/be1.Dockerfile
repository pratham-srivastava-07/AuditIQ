# dockerfile/be1.Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY be1/package*.json ./
RUN npm install

COPY be1 ./
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
