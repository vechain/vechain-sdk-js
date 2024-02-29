# Sample Hardhat project

This is a sample project that showcases the usage of the vechain SDK Hardhat plugin, specifically the hardhat-plugin package, with illustrative examples.

## Introduction

The hardhat-plugin package serves as a crucial link between Hardhat and the vechain SDK, simplifying the process of creating, testing, and interacting with smart contracts on the VeChainThor blockchain network. Developers can utilize the functionalities provided by this plugin to seamlessly integrate vechain's blockchain infrastructure into their Hardhat projects.

## Commands

- **Install dependencies**: Execute `yarn install` to install the required dependencies.
- **Compile**: Execute `npx hardhat compile` to compile the smart contracts in the `contracts` folder.
- **Testing**: Execute `npx hardhat test` to test the smart contracts running the tests located on the `test` folder.
- **Deploy**: Execute `npx hardhat run scripts/deploy.ts` to deploy the smart contracts in the `contracts` folder. Remember to add `--network vechain_testnet` at the end of the command to specify the network you want to use (you cand find available vechain networks on the hardhat config file `hardhat,config.js`).