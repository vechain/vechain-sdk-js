# Sample Hardhat project

This is a sample project that showcases the usage of the VeChain SDK Hardhat plugin, specifically the hardhat-plugin package, with illustrative examples.

## Introduction

The hardhat-plugin package serves as a crucial link between Hardhat and the VeChain SDK, simplifying the process of creating, testing, and interacting with smart contracts on the VeChainThor blockchain network. Developers can utilize the functionalities provided by this plugin to seamlessly integrate vechain's blockchain infrastructure into their Hardhat projects.

## Commands

- **Install dependencies**: Execute `yarn install` to install the required dependencies.
- **Compile**: Execute `yarn compile` to compile the smart contracts in the `contracts` folder.
- **Testing**: Execute `yarn test` to test the smart contracts running the tests located on the `test` folder.
- **Deploy**: Execute `yarn deploy-solo` to deploy the smart contracts on the solo network, and `yarn deploy-testnet` to deploy on the VeChain testnet. 

## Usage

The `hardhat.config.js` is the main configuration file. By specifying the desired network configurations, such as the network URL and the accounts to be used for signing transactions, developers can seamlessly switch between different networks and environments. Additionally, settings like enabling logging can also be configured to provide more detailed information during development and testing. 
Note that:

- The network name should contain `vechain`, otherwise, it may result in an error.
- In the network configuration, two additional fields can be added: `gasPayer` and `useDebug`. These fields allow for more customization and control over the network settings, catering to specific project requirements and preferences.
   - **Debug Mode**: The `debug` field enables or disables debug mode.
   - **Gas Payer**: The `gasPayer` field allows you to delegate the transaction to a gasPayer. It supports two optional parameters: `gasPayerPrivateKey` and `gasPayerServiceUrl`.
- When configuring your Solidity compiler settings in hardhat.config.js, it's recommended to set the evmVersion depending on the node version like so:Add commentMore actions
   - "Paris" pre-galactica hard fork
   - "Shanghai" post-galactica hard fork 

   For projects targeting the latest EVM functionalities. This setting ensures that the compiled bytecode is optimized for the most recent features and gas cost adjustments associated with the selected EVM version. Using an EVM version other than these ones could potentially lead to issues with unsupported opcodes, especially if your contracts rely on newer EVM features introduced in or after the selected version update.

This flexibility in the configuration file allows developers to tailor their development experience and adapt it to the requirements of their projects, ensuring a smooth and efficient development process.
