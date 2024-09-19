# @vechain/sdk-ethers-adapter

Welcome to the **sdk-ethers-adapter** package of the VeChain SDK! This package serves as a crucial bridge between the standard Ethereum tooling provided by Hardhat and the unique features of the VeChainThor blockchain. By utilizing this adapter, the hardhatVeChain plugin can seamlessly integrate veChain's capabilities, leveraging the Hardhat environment for smart contract deployment and testing on veChain's network.

## Features

- **Ethers.js Integration**: Fully compatible with ethers.js, providing a familiar interface for Ethereum developers.
- **vechain Extensions**: Implements vechain-specific functionalities, such as multi-clause transactions, fee delegation, and native token (VET and VTHO) handling.
- **Custom Provider**: Includes a VeChainThor Provider to interact with the VeChainThor blockchain.
- **Transaction Signing**: Enhancements for signing transactions using vechain's unique model, including support for block ref and expiration.
- **Contract Interaction**: Facilitates interaction with contracts deployed on the VeChainThor blockchain, taking into account vechain-specific transaction parameters.

## Installation

To install the `@vechain/sdk-ethers-adapter`, run the following command in your project directory:

```bash
npm install @vechain/sdk-ethers-adapter
