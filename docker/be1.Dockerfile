# be1.Dockerfile

FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY grpc/be1/package*.json ./
RUN npm install

# Copy source files
COPY grpc/be1 .

# Build TypeScript to JS
RUN npm run build



# Expose REST API port
EXPOSE 3000

# Run the compiled JS
CMD ["node", "dist/index.js"]
