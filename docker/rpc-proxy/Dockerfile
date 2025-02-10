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
COPY ./docker/rpc-proxy/adjust-packages.sh ./adjust-packages.sh

# Install all the dependencies and build the app
RUN apk update && apk upgrade openssl
RUN yarn install && yarn build

# Clean the package.json files ready for production
RUN apk add --no-cache jq
RUN chmod +x ./adjust-packages.sh
RUN /bin/sh ./adjust-packages.sh ./

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
## Just PROD dependencies
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock
WORKDIR /app
RUN yarn workspace @vechain/sdk-rpc-proxy install --production --frozen-lockfile --ignore-scripts --prefer-offline \
    && yarn cache clean \
    && adduser -D rpc-proxy-user
# Create a new user to run the app so we do not use root
USER rpc-proxy-user

# Tell we are running with Docker
ENV RUNNING_WITH_DOCKER=true

# Set the default command to use node to run the app
CMD ["node", "packages/rpc-proxy/dist/index.js"]
