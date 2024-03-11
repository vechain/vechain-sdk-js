# Architecture

The chapter is designed to provide a high-level understanding of the vechain SDK architecture and structure. 
Comprehensive diagrams, following the C4 model, are available for reference in the project's [GitHub repository](https://github.com/vechain/vechain-sdk-js/tree/main/docs/diagrams/architecture).

## Introduction

Basically the `vechain-sdk` is a monorepo divided into different packages packages:

- **Core Package**
- **Error Package**
- **Network Package**
- **Hardhat Plugin Package**
- **Logging Package**
- **Provider Package**
- **Wallet Package**
- **RPC Proxy Package**


Each of these packages has its own responsibility and is described in the following chapters.

### Core Package
The core package is the core functionality responsible package of the vechain-sdk.
It is responsible for all core functionality of the vechain-sdk.

### Error Package
The error package is the error handling responsible package of the vechain-sdk.
It is responsible for all error handling of the vechain-sdk.

### Network Package
The network package is the network interaction responsible package of the vechain-sdk.
It is responsible for all interactions with the blockchain.

### Hardhat Plugin Package
Seamlessly integrate the vechain SDK with Hardhat, the Ethereum development environment. 
This plugin provides a bridge between the vechain SDK and the Ethereum ecosystem, enabling you to leverage the best of both worlds.

### Logging Package
The logging package provides a simple and easy-to-use logging system for the vechain SDK. 
This module is dedicated to managing and customizing logs within the SDK, ensuring your development experience remains transparent and insightful.

### Provider Package
Get the maximum of EVM development stack with provider package. 
This module is dedicated to managing the compatibility with ethers and EVM world.

### Wallet Package
Secure your assets and manage transactions with ease using the wallet package. 
This module provides functionality for creating and managing vechain wallets, as well as signing and broadcasting transactions securely on the VechainThor blockchain.

### RPC Proxy Package
This package is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC.
