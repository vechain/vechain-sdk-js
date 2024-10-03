# Stage 1: Build the app
FROM node:20.17-alpine3.20 AS builder

# Set the working directory in the builder stage
WORKDIR /app

# Copy the dependencies file to the working directory
COPY ./packages/rpc-proxy ./packages/rpc-proxy
COPY ./packages/network ./packages/network
COPY ./packages/core ./packages/core
COPY ./packages/logging ./packages/logging
COPY ./packages/errors ./packages/errors
COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json
COPY ./yarn.lock ./yarn.lock
COPY ./tsconfig.json ./tsconfig.json

# Install all the dependencies
RUN yarn install

# Build the app (assumes output is in /app/dist or similar)
RUN yarn build

# Stage 2: Serve the app using node
FROM node:20.17.0-alpine3.20 AS runner

# Copy only the built files and essential runtime files from the builder stage
## rpc-proxy
COPY --from=builder /app/packages/rpc-proxy/dist /app/packages/rpc-proxy/dist
COPY --from=builder /app/packages/rpc-proxy/package.json /app/packages/rpc-proxy/package.json
COPY --from=builder /app/packages/rpc-proxy/solo-config.json /app/packages/rpc-proxy/solo-config.json
## SDK dependencies
COPY --from=builder /app/packages/network/dist /app/packages/network/dist
COPY --from=builder /app/packages/network/package.json /app/packages/network/package.json
COPY --from=builder /app/packages/core/dist /app/packages/core/dist
COPY --from=builder /app/packages/core/package.json /app/packages/core/package.json
COPY --from=builder /app/packages/logging/dist /app/packages/logging/dist
COPY --from=builder /app/packages/logging/package.json /app/packages/logging/package.json
COPY --from=builder /app/packages/errors/dist /app/packages/errors/dist
COPY --from=builder /app/packages/errors/package.json /app/packages/errors/package.json
## node_modules
COPY --from=builder /app/node_modules /app/node_modules

# Create a new user to run the app so we do not use root
RUN adduser -D rpc-proxy-user
USER rpc-proxy-user

# Tell we are running with Docker
ENV RUNNING_WITH_DOCKER=true

# Set the default command to use node to run the app
CMD ["node", "/app/packages/rpc-proxy/dist/index.js"]