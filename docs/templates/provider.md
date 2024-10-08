# Provider

## Overview

The VeChain Provider is a powerful tool designed to interact with the VeChain blockchain seamlessly. This documentation outlines the features, usage, and configuration of the VeChain Provider and its companion, the Hardhat Provider.

## VeChain Provider

The VeChain Provider is our core provider, offering direct interaction with the VeChain blockchain. It extends EventEmitter and implements EIP1193ProviderMessage for efficient event handling and message passing.

### Features

 - Seamless interaction with the VeChain blockchain.
 - Event handling capabilities using EventEmitter.
 - Implementation of EIP1193ProviderMessage for standardized message communication.

### Usage

To use the VeChain Provider in your project, follow these steps:
 - Import the provider in your code:
    ``` bash
    import { VeChainProvider } from '@vechain/sdk-network';
    ```
 - Initialize the provider:
    ``` bash
    const provider = new VeChainProvider(thorClient, wallet);
    ```
 - Start interacting with the VeChain blockchain using the available methods provided by the VeChainProvider.

Example:
[VeChainProviderSnippet](examples/provider/vechain-provider.ts)

## HardHat Provider

The Hardhat Provider is a wrapper around the core VeChain Provider specifically designed for Hardhat integration. It simplifies the process of using the VeChain Provider within a Hardhat environment.

### Features

 - Wrapper around the core VeChain Provider.
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
 - Start interacting with the VeChain blockchain using the available methods provided by the HardhatVeChainProvider.

Example:

[VechainHardhatProviderSnippet](examples/provider/vechain-hardhat-provider.ts)