# VeChain SDK Solo Setup

This package provides a complete local development environment for VeChain Thor blockchain development. It includes Docker-based Thor node setup, pre-configured test accounts, funding utilities, and contract deployment functionality.

## Overview

The `@vechain/sdk-core-solo-setup` package offers:

- A dockerized Thor node running in "solo" mode for local development
- Pre-configured test accounts with automated funding
- Deployment scripts for test contracts
- Utilities for transferring VET, VTHO, and TestToken
- Configuration management for the local environment

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Yarn](https://yarnpkg.com/) or npm

## Installation

This package is part of the VeChain JavaScript SDK. If you're working within the SDK monorepo, it's already included. Otherwise, you can add it to your project:

```bash
yarn add @vechain/sdk-core-solo-setup
# or
npm install @vechain/sdk-core-solo-setup
```

## Usage

### Starting the Thor Solo Node

```bash
# Using npm scripts
yarn solo-up
# or
npm run solo-up

# Using make directly
make solo-up
```

### Stopping the Thor Solo Node

```bash
# Using npm scripts
yarn solo-down
# or
npm run solo-down

# Using make directly
make solo-down
```

### Seeding Accounts and Deploying Contracts

After starting the Thor Solo node, you need to seed the accounts and deploy test contracts:

```bash
yarn solo-seed
# or
npm run solo-seed
```

This will:

1. Deploy the `TestingContract` and `TestingToken` contracts
2. Seed predefined accounts with VET, VTHO, and TestToken (10,000 units each)
3. Generate configuration data for the environment

### Thor Solo Node

The Thor Solo node runs with the following configuration:

- API available at `http://localhost:8669`
- On-demand block creation (creates new blocks when transactions are pending)
- Gas limit of 150,000,000
- Persistence disabled

### Available Accounts

The environment provides two types of accounts:

1. **Genesis Accounts**: 10 pre-funded accounts with large balances
2. **Seeded Accounts**: 30 additional accounts funded during setup with:
    - 10,000 VET
    - 10,000 VTHO
    - 10,000 TestToken

### Test Contracts

Two contracts are deployed by default:

1. `TestingContract`: A basic contract for testing purposes
2. `TestingToken`: An ERC-20 token with an initial supply of 1,000,000 tokens

## Programmatic Usage

You can use the package in your code to access accounts and configuration data:

```typescript
import {
    AccountDispatcher,
    getConfigData,
    THOR_SOLO_DEFAULT_MNEMONIC
} from '@vechain/sdk-core-solo-setup';

// Get the next available account
const dispatcher = new AccountDispatcher();
const account = dispatcher.getNextAccount();
console.log(`Using account: ${account.address}`);

// Get the configuration data
const config = getConfigData();
console.log(`TestingToken address: ${config.TEST_TOKEN_ADDRESS}`);
```

## Configuration

The configuration data is stored in `config.json` in the package root and includes:

- Contract addresses and ABIs
- Transaction IDs for seeding operations
- Genesis block information

## Troubleshooting

- If you encounter issues with the Docker container, try stopping and restarting it with `yarn solo-down` followed by `yarn solo-up`
- Ensure Docker is running before starting the environment
- If the `solo-seed` command fails, check that the Thor node is running and accessible at `http://localhost:8669`
- Check Docker logs for any issues: `docker logs thor-solo`

## License

This package is part of the VeChain JavaScript SDK and is subject to the same license terms.
