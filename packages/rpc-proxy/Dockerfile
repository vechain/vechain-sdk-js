# Stage 1: Build the app
FROM node:20.17-alpine3.20 AS builder

# Set the working directory in the builder stage
WORKDIR /app

# Copy the dependencies file to the working directory
COPY ./ /app

# Install all the dependencies
RUN yarn install

# Build the app (assumes output is in /app/dist or similar)
RUN yarn build

# Stage 2: Serve the app using node
FROM node:20.17.0-alpine3.20 AS runner

# Set the working directory in the final stage
WORKDIR /app

# Create a new user to run the app so we do not use root
RUN adduser -D rpc-proxy-user
USER rpc-proxy-user

# Copy only the built files and essential runtime files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules

# Set the default command to use node to run the app
CMD ["node", "dist/index.js", "-c", "config.json"]
