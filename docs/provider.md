# Provider

## Overview

TheVeChain Provider is a powerful tool designed to interact with theVeChain blockchain seamlessly. This documentation outlines the features, usage, and configuration of theVeChain Provider and its companion, the Hardhat Provider.

##VeChain Provider

TheVeChain Provider is our core provider, offering direct interaction with theVeChain blockchain. It extends EventEmitter and implements EIP1193ProviderMessage for efficient event handling and message passing.

### Features

 - Seamless interaction with theVeChain blockchain.
 - Event handling capabilities using EventEmitter.
 - Implementation of EIP1193ProviderMessage for standardized message communication.

### Usage

To use theVeChain Provider in your project, follow these steps:
 - Import the provider in your code:
    ``` bash
    import { VeChainProvider } from '@vechain/sdk-network';
    ```
 - Initialize the provider:
    ``` bash
    const provider = new VeChainProvider(thorClient, wallet);
    ```
 - Start interacting with theVeChain blockchain using the available methods provided by the VeChainProvider.

Example:
```typescript { name=vechain-provider, category=example }
// 1 - Create thor client for testnet
const testnetUrl = 'https://testnet.vechain.org';
const thorClient = ThorClient.fromUrl(testnetUrl);

// 2 - Init provider
const provider = new VeChainProvider(thorClient);

// 3 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});
```

## HardHat Provider

The Hardhat Provider is a wrapper around the coreVeChain Provider specifically designed for Hardhat integration. It simplifies the process of using theVeChain Provider within a Hardhat environment.

### Features

 - Wrapper around the coreVeChain Provider.
 - Simplified integration with Hardhat projects.

### Usage

To use the Hardhat Provider in your project, follow these steps:
 - Import the provider in your code:
    ``` bash
    import { HardhatVeChainProvider } from '@vechain/sdk-network';
    ```
 - Initialize the provider:
    ``` bash
    const provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            testnetUrl,
            (message: string, parent?: Error) => new Error(message, parent)
        );
    ```
 - Start interacting with theVeChain blockchain using the available methods provided by the HardhatVeChainProvider.

Example:
```typescript { name=vechain-hardhat-provider, category=example }
const testnetUrl = 'https://testnet.vechain.org';

// 1 - Init provider
const provider = new HardhatVeChainProvider(
    new ProviderInternalBaseWallet([]),
    testnetUrl,
    (message: string, parent?: Error) => new Error(message, parent)
);

// 2 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});
```
