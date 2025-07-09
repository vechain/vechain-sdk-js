# VeChain Solo Setup CLI

A command-line interface for setting up and managing a local VeChain Thor blockchain development environment. This package provides a complete local development environment for VeChain Thor blockchain development, including Docker-based Thor node setup, pre-configured test accounts, funding utilities, and contract deployment functionality with file-based configuration.

## Features

- **Dockerized Thor Node** running in "solo" mode for local development
- **File-based Configuration** with automatic JSON generation
- **Pre-configured Test Accounts** with automated funding
- **Contract Deployment** scripts for test contracts
- **Utilities** for transferring VET, VTHO, and TestToken
- **Simple CLI** for easy environment management

## CLI Installation

Install globally to use the `solo-setup` command anywhere:

```bash
yarn global add @vechain/solo-setup
# or
npm install -g @vechain/solo-setup
```

## CLI Usage

Once installed globally, you can use the `solo-setup` command from anywhere:

```bash
# Start the Thor solo node
solo-setup up

# Deploy contracts and seed accounts (run after 'up')
solo-setup seed

# Check Thor node status
solo-setup status

# View current configuration
solo-setup config

# View Thor node logs
solo-setup logs

# Stop the service
solo-setup down

# Clean up containers and volumes
solo-setup clean

# Show help
solo-setup help
```

### Quick Start

```bash
# 1. Install globally
yarn global add @vechain/solo-setup

# 2. Start the development environment
solo-setup up

# 3. Deploy contracts and seed accounts
solo-setup seed

# 4. Your development environment is ready!
# Thor node API: http://localhost:8669
# Configuration: config.json file in package directory
```

## Overview

The `@vechain/sdk-solo-setup` package offers:

- A dockerized Thor node running in "solo" mode for local development
- **File-based configuration** stored in `config.json`
- Pre-configured test accounts with automated funding
- Deployment scripts for test contracts
- Utilities for transferring VET, VTHO, and TestToken
- Simple API for accessing configuration data

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Yarn](https://yarnpkg.com/) (preferred) or npm

## Installation

This package is part of the VeChain JavaScript SDK. If you're working within the SDK monorepo, it's already included. Otherwise, you can add it to your project:

```bash
yarn add @vechain/solo-setup
# or
npm install @vechain/solo-setup
```

## Usage

### Starting the Thor Node

```bash
# Using CLI
solo-setup up

# Using yarn scripts
yarn solo-up
# or
npm run solo-up

# Using make directly
make solo-up
```

This starts the Thor Solo Node on port 8669.

### Stopping the Thor Node

```bash
# Using CLI
solo-setup down

# Using yarn scripts
yarn solo-down
# or
npm run solo-down

# Using make directly
make solo-down
```

### Seeding Accounts and Deploying Contracts

After starting the Thor node, you need to seed the accounts and deploy test contracts:

```bash
# Using CLI
solo-setup seed

# Using yarn scripts
yarn solo-seed
# or
npm run solo-seed
```

This will:
1. Deploy the `TestingContract` and `TestingToken` contracts
2. Seed predefined accounts with VET, VTHO, and TestToken (10,000 units each)
3. Generate a `config.json` file with all contract addresses and transaction IDs

### Thor Solo Node

The Thor Solo node runs with the following configuration:
- API available at `http://localhost:8669`
- On-demand block creation (creates new blocks when transactions are pending)
- Gas limit of 150,000,000
- Persistence enabled

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

### Configuration Access

```typescript
import { 
  getConfigData
} from '@vechain/sdk-solo-setup';

// Get configuration from config.json
const config = getConfigData();
console.log(`TestingContract address: ${config.TESTING_CONTRACT_ADDRESS}`);
console.log(`TestingToken address: ${config.TEST_TOKEN_ADDRESS}`);

// Access contract ABI
const testingContractABI = config.TESTING_CONTRACT_ABI;

// Access transaction IDs
const vetSeedTx = config.SEED_VET_TX_ID;
const vthoSeedTx = config.SEED_VTHO_TX_ID;
const tokenSeedTx = config.SEED_TEST_TOKEN_TX_ID;

// Access genesis block info
const genesisBlock = config.SOLO_GENESIS_BLOCK;
```

### Account Management

```typescript
import { AccountDispatcher } from '@vechain/sdk-solo-setup';

const dispatcher = AccountDispatcher().getInstance();
const account = dispatcher.getNextAccount();
console.log(`Using account: ${account.address}`);
```

## Configuration Structure

The generated `config.json` file contains:

```json
{
  "TESTING_CONTRACT_ADDRESS": "0x...",
  "TESTING_CONTRACT_ABI": [...],
  "TESTING_CONTRACT_BYTECODE": "0x...",
  "TEST_TOKEN_ADDRESS": "0x...",
  "SOLO_GENESIS_BLOCK": {
    "number": 0,
    "id": "0x...",
    "timestamp": 1234567890
  },
  "SEED_VET_TX_ID": "0x...",
  "SEED_VTHO_TX_ID": "0x...",
  "SEED_TEST_TOKEN_TX_ID": "0x..."
}
```

## Configuration Storage

Configuration is stored in a `config.json` file that is:

- **Automatically generated** when you run `solo-setup seed`
- **Located** in the package directory
- **Included** in the npm package for distribution
- **Accessible** via the `getConfigData()` function

## CLI Commands Reference

| Command | Description |
|---------|-------------|
| `solo-setup up` | Start the Thor solo node |
| `solo-setup down` | Stop the Thor solo node |
| `solo-setup seed` | Deploy contracts and seed accounts |
| `solo-setup status` | Check Thor node status and configuration |
| `solo-setup config` | Display current configuration |
| `solo-setup logs` | Show Thor node logs |
| `solo-setup clean` | Clean up containers and volumes |
| `solo-setup help` | Show help information |

## Troubleshooting

- If you encounter issues with the Docker container, try stopping and restarting it with `solo-setup down` followed by `solo-setup up`
- Ensure Docker is running before starting the environment
- If the `solo-setup seed` command fails, check that the Thor node is running and accessible at `http://localhost:8669`
- Check Docker logs for any issues: `docker logs thor-solo`
- If configuration is not found, run `solo-setup seed` to generate the `config.json` file

## Development

```bash
# Install dependencies
yarn install

# Build the project
yarn build

# Start Thor node
yarn solo-up

# Run seeding
yarn solo-seed

# Check status
solo-setup status

# View configuration
solo-setup config
```

## License

This package is part of the VeChain JavaScript SDK and is subject to the same license terms.
