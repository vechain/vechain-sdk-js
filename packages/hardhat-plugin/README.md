# @vechain/sdk-hardhat-plugin

Welcome to the **hardhat-plugin package** of the VeChain SDK!

## Introduction

The VeChain SDK Hardhat plugin bridges the gap between Hardhat and the VeChain SDK, providing developers with a seamless interface. This versatile package is essential for smart contract development on the VeChainThor blockchain.

## Key Features

This plugin simplifies the creation, testing, deployment, and interaction with smart contracts. It allows developers to build robust decentralized applications (dApps) and services on VeChainThor. By integrating the VeChain SDK into Hardhat, developers can leverage VeChain's powerful blockchain infrastructure within the familiar Hardhat development environment.

## Installation and Setup

### Prerequisites
Before using the VeChain SDK Hardhat plugin, ensure you have Hardhat installed:
``` bash
yarn add --dev hardhat
```
Initialize your Hardhat project:
``` bash
npx hardhat
```

### Adding VeChain Support
 - Install the VeChain Hardhat plugin:
``` bash
yarn add @vechain/sdk-hardhat-plugin
```
 - Modify your hardhat.config.ts file as follows:
 ``` typescript
 import '@vechain/sdk-hardhat-plugin';

import { VET_DERIVATION_PATH } from '@vechain/sdk-core';
import { type HttpNetworkConfig } from 'hardhat/types';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.17', // Specify the first Solidity version
        settings: {
            // Additional compiler settings for this version
            optimizer: {
                enabled: true,
                runs: 200
            },
            evmVersion: 'london' // EVM version (e.g., "byzantium", "constantinople", "petersburg", "istanbul", "berlin", "london")
        }
    },
    ]
  },
  networks: {
    vechain_testnet: {
      // Testnet
      url: 'https://testnet.vechain.org',
      accounts: {
          mnemonic:
              'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
          path: VET_DERIVATION_PATH,
          count: 3,
          initialIndex: 0,
          passphrase: 'vechainthor'
      },
      debug: true,
      delegator: undefined,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      timeout: 20000,
      httpHeaders: {}
  } satisfies HttpNetworkConfig,
  }
};
```

## Example

For a comprehensive example of using the Hardhat plugin with the VeChain SDK, visit [`apps/sdk-hardhat-integration`](https://github.com/vechain/vechain-sdk-js/tree/main/apps/sdk-hardhat-integration). This directory contains a fully configured example that demonstrates how to integrate the VeChain SDK with Hardhat, providing a practical setup you can follow and replicate in your projects.

