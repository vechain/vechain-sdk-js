# Provider

## Overview

The vechain Provider is a powerful tool designed to interact with the vechain blockchain seamlessly. This documentation outlines the features, usage, and configuration of the vechain Provider and its companion, the Hardhat Provider.

## Vechain Provider

The vechain Provider is our core provider, offering direct interaction with the vechain blockchain. It extends EventEmitter and implements EIP1193ProviderMessage for efficient event handling and message passing.

### Features

 - Seamless interaction with the vechain blockchain.
 - Event handling capabilities using EventEmitter.
 - Implementation of EIP1193ProviderMessage for standardized message communication.

### Usage

To use the vechain Provider in your project, follow these steps:
 - Install the package:
    ``` bash
    yarn add @vechain/sdk-provider
    ```
 - Import the provider in your code:
    ``` bash
    import { VechainProvider } from '@vechain/sdk-provider';
    ```
 - Initialize the provider:
    ``` bash
    const provider = new VechainProvider(thorClient, wallet);
    ```
 - Start interacting with the VeChain blockchain using the available methods provided by the VeChainProvider.

Example:
```typescript { name=vechain-provider, category=example }
import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { VechainProvider } from '@vechain/sdk-provider';
import { expect } from 'expect';

// 1 - Create thor client for testnet
const testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Init provider
const provider = new VechainProvider(thorClient);

// 3 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});

expect(rpcCallChainId).toBe('0x186aa');

```

## HardHat Provider

The Hardhat Provider is a wrapper around the core vechain Provider specifically designed for Hardhat integration. It simplifies the process of using the vechain Provider within a Hardhat environment.

### Features

 - Wrapper around the core vechain Provider.
 - Simplified integration with Hardhat projects.

### Usage

To use the Hardhat Provider in your project, follow these steps:
 - Install the package:
    ``` bash
    yarn add @vechain/sdk-provider
    ```
 - Import the provider in your code:
    ``` bash
    import { HardhatVechainProvider } from '@vechain/sdk-provider';
    ```
 - Initialize the provider:
    ``` bash
    const provider = new HardhatVechainProvider(
            new BaseWallet([]),
            testnetUrl,
            (message: string, parent?: Error) => new Error(message, parent)
        );
    ```
 - Start interacting with the VeChain blockchain using the available methods provided by the HardhatVechainProvider.

Example:
```typescript { name=vechain-hardhat-provider, category=example }
import { HardhatVechainProvider } from '@vechain/sdk-provider';
import { BaseWallet } from '@vechain/sdk-wallet';
import { expect } from 'expect';

const testnetUrl = 'https://testnet.vechain.org';

// 1 - Init provider
const provider = new HardhatVechainProvider(
    new BaseWallet([]),
    testnetUrl,
    (message: string, parent?: Error) => new Error(message, parent)
);

// 2 - Call RPC function
const rpcCallChainId = await provider.request({
    method: 'eth_chainId'
});

expect(rpcCallChainId).toBe('0x186aa');

```
