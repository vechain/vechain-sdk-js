# Sample Hardhat project

This is a sample project that showcases the usage of the vechain SDK Hardhat plugin, specifically the hardhat-plugin package, with illustrative examples.

## Introduction

The hardhat-plugin package serves as a crucial link between Hardhat and the vechain SDK, simplifying the process of creating, testing, and interacting with smart contracts on the VeChainThor blockchain network. Developers can utilize the functionalities provided by this plugin to seamlessly integrate vechain's blockchain infrastructure into their Hardhat projects.

## Commands

- **Install dependencies**: Execute `yarn install` to install the required dependencies.
- **Compile**: Execute `yarn compile` to compile the smart contracts in the `contracts` folder.
- **Testing**: Execute `yarn test` to test the smart contracts running the tests located on the `test` folder.
- **Deploy**: Execute `yarn deploy-solo` to deploy the smart contracts on the solo network, and `yarn deploy-testnet` to deploy on the vechain testnet. 

## Usage
The `hardhat.config.js` is the main configuration file. By specifying the desired network configurations, such as the network URL and the accounts to be used for signing transactions, developers can seamlessly switch between different networks and environments. Additionally, settings like enabling logging can also be configured to provide more detailed information during development and testing. This flexibility in the configuration file allows developers to tailor their development experience and adapt it to the requirements of their projects, ensuring a smooth and efficient development process.