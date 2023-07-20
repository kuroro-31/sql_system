# Dockerfile
# Use the official lightweight Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . ./

# Build the application
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]
