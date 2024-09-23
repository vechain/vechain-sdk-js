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

# Copy only the built files and essential runtime files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/run-proxy-docker.sh /app/

# Create a new user to run the app so we do not use root
RUN adduser -D rpc-proxy-user
USER rpc-proxy-user

# Set environment arguments
ARG URL
ENV ENV_URL=$URL

ARG PORT
ENV ENV_PORT=$PORT

ARG ACCOUNTS
ENV ENV_ACCOUNTS=$ACCOUNTS

ARG MNEMONIC
ENV ENV_MNEMONIC=$MNEMONIC

ARG MNEMONIC_COUNT
ENV ENV_MNEMONIC_COUNT=$MNEMONIC_COUNT

ARG MNEMONIC_INITIAL_INDEX
ENV ENV_MNEMONIC_INITIAL_INDEX=$MNEMONIC_INITIAL_INDEX

ARG ENABLE_DELEGATION
ENV ENV_ENABLE_DELEGATION=$ENABLE_DELEGATION

ARG DELEGATOR_PRIVATE_KEY
ENV ENV_DELEGATOR_PRIVATE_KEY=$DELEGATOR_PRIVATE_KEY

ARG DELEGATOR_URL
ENV ENV_DELEGATOR_URL=$DELEGATOR_URL

ARG VERBOSE
ENV ENV_VERBOSE=$VERBOSE

ARG CONFIGURATION_FILE
ENV ENV_CONFIGURATION_FILE=$CONFIGURATION_FILE

# Set the default command to use node to run the app
CMD ["sh", "-c", "url=${ENV_URL} port=${ENV_PORT} accounts=${ENV_ACCOUNTS} mnemonic=${ENV_MNEMONIC} mnemonicCount=${ENV_MNEMONIC_COUNT} mnemonicInitialIndex=${ENV_MNEMONIC_INITIAL_INDEX} enableDelegation=${ENV_ENABLE_DELEGATION} delegatorPrivateKey=${ENV_DELEGATOR_PRIVATE_KEY} delegatorUrl=${ENV_DELEGATOR_URL} verbose=${ENV_VERBOSE} configurationFile=${ENV_CONFIGURATION_FILE} sh run-proxy-docker.sh"]