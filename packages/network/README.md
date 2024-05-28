# @vechain/sdk-network

Welcome to the **network package** of the VeChain SDK!

## Introduction

Vechain SDK Network serves as the standard interface connecting decentralized applications (dApps) and users to the VeChainThor blockchain. This versatile package is essential for dApp development and facilitates blockchain operations. Developers rely on VeChain SDK Network to effortlessly create, sign, and broadcast transactions to the VeChainThor blockchain network.

## Key Features

Explore the rich feature set of the VeChain SDK Network package, tailored for VeChainThor blockchain and dApp development:

- **Blocks and Node Status**: Interact with and retrieve information about blocks on the VeChainThor blockchain.VeChain SDK Network allows developers to access block data and query the status of connected VeChain nodes.
- **Accounts**: Facilitate interactions with Externally Owned Accounts (EOAs), empowering developers to manage and transact with individual user accounts on the VeChainThor blockchain. This includes sending VET tokens and interacting with VTHO (VeThor) tokens.
- **Smart Contracts**: With VeChain SDK Network, seamlessly interact with and manage smart contracts deployed on the VeChainThor blockchain. Deploy contracts, invoke functions, and retrieve contract data effortlessly.
- **Transactions**: Initiate various transactions on the VeChainThor blockchain using VeChain SDK Network. Developers can create and broadcast transactions, including token transfers, contract interactions, and asset management.
- **Certificates**: Manage certificates and certificate-related operations on the blockchain with VeChain SDK Network. Certificates play a crucial role in identity verification and access control within dApps.
- **Queries**: Efficiently retrieve specific data from the blockchain using VeChain SDK Network's querying system. This includes querying transaction details, contract state, and other relevant blockchain information for streamlined dApp development.
- **Provider**: Provider, with his internal wallet (ProviderInternalWallet) allows the user to exploit the standard Provider structure (EIP-1193). Thanks to this, we can have the RPC on vechain!
- **Signer**: Signer is a class that allows to sign transactions and messages.

Vechain SDK Network is your all-in-one solution for seamlessly integrating with the VeChainThor blockchain, providing a reliable and feature-rich experience for dApp developers. Dive into the world of VeChain SDK Network and elevate your decentralized applications with ease.

## Commands

- **Build**: Execute `yarn build` to build the package.
- **Lint**: Execute `yarn lint` to lint the package.
- **Format**: Execute `yarn format` to format the package.
- **Test:unit**: Execute `yarn test:unit` to run unit tests.
- **Test:integration**: Execute `yarn test:integration` to run integration tests.
- **Test**: Execute `yarn test` to run all tests on the package.
   - **NOTE**: Tests and Integration tests require thor-solo to be running locally. You can run and stop separately thor solo node with `yarn start-thor-solo` and `yarn stop-thor-solo` or run all tests with `yarn test:solo` which will start thor solo node, run all tests and stop thor solo at the end. Same for integration tests. You can directly run `yarn test:integration:solo` to run integration tests with thor solo.

## Usage

Explore examples of how to use this package in real-world scenarios at [vechain SDK examples](https://github.com/vechain/vechain-sdk/tree/main/docs/examples).

Feel free to leverage these resources and don't hesitate to reach out if you have any questions or need further assistance.

Happy coding with the VeChain SDK!
