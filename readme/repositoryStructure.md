## Repository Structure

Welcome to the VeChain SDK repository! Here's a breakdown of our organized structure:

- `./apps`: Explore a suite of sample applications that demonstrate the versatility and power of our SDK in real-world scenarios. From Next.js to Node.js, HardHat, and CloudFlare, these examples serve as practical guides to kickstart your development journey.
- `./docker`: Streamline your development and deployment with our comprehensive Docker configurations. This directory offers Dockerfile setups designed to create consistent, reproducible environments.
- `./docs`: Your go-to destination for comprehensive documentation. Explore demonstrative examples showcasing the prowess of our SDK. Knowledge is power, and our docs are here to enlighten your path.
- `./packages`: A hub for our monorepo packages, each serving a distinct purpose:
   - `./packages/aws-kms-adapter`: The AWS KMS Adapter provides a secure way to sign transactions using AWS Key Management Service (KMS). This adapter allows you to leverage AWS KMS to manage and protect your private keys, ensuring that sensitive cryptographic operations are performed in a secure environment.
   - `./packages/core`: The heart of the SDK, housing essential modules for fundamental operations like hashing and cryptography. Dive into the core for the building blocks of your decentralized dreams.
   - `./packages/errors`: Delve into the world of error handling with the error package. This module is dedicated to managing and customizing errors within the SDK, ensuring your development experience remains resilient and smooth.
   - `./packages/hardhat-plugin`: Seamlessly integrate the VeChain SDK with Hardhat, the Ethereum development environment. This plugin provides a bridge between the VeChain SDK and the Ethereum ecosystem, enabling you to leverage the best of both worlds.
   - `./packages/logging`: The logging package provides a simple and easy-to-use logging system for the VeChain SDK. This module is dedicated to managing and customizing logs within the SDK, ensuring your development experience remains transparent and insightful.
   - `./packages/network`: Embark on a journey through the network module, your gateway to all things related to blockchain interaction and transaction dissemination. Here, the VeChain SDK connects you seamlessly to the VeChainThor blockchain.
   - `./packages/rpc-proxy`: This package is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC.
- `./scripts`: Enhance your workflow efficiency with our collection of utility scripts. Located here are tools for tasks like automated testing, pre-release preparations, and file validation.

Explore, experiment, and let the VeChain SDK empower your blockchain adventures!