# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY ./ /app

# Install all the dependencies
RUN yarn install

# Build the app
RUN yarn build

# Serve the app
ENTRYPOINT ["yarn", "start"]