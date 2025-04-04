---
description: EVM Extension
---

The VeChainThor Extension Contracts are a collection of Solidity smart contracts tailored for utilization on the VeChainThor blockchain platform. VeChainThor, a blockchain ecosystem emphasizing enterprise solutions and decentralized applications (dApps), benefits from these contracts to extend the Ethereum Virtual Machine (EVM) global functions, thereby enhancing blockchain interaction capabilities.

## Purpose

The primary objective of these contracts is to provide developers with streamlined access to critical blockchain functionalities specific to the VeChainThor network. They serve as a bridge between smart contracts deployed on VeChainThor and the underlying blockchain infrastructure. By encapsulating native operations within accessible Solidity functions, these contracts simplify the development process for decentralized applications and smart contracts on the platform.

## Features

The Extension Contracts offer a comprehensive set of functions covering essential blockchain operations:

 - Retrieval of block-specific details, including block ID, total score, time, and signer address.
 - Access to transaction information, such as transaction ID, block reference, and expiration time.
 - Querying the total supply of tokens and proven work for transactions.

## Example

```typescript { name=evm-extension, category=example }
// Create an instance of the ThorClient class
const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

// Call the getTotalSupply function of the `TestingContract` smart contract
const totalSupply = await thorSoloClient.contracts.executeCall(
    TESTING_CONTRACT_ADDRESS,
    ABIContract.ofAbi(soloConfig.TESTING_CONTRACT_ABI).getFunction(
        'getTotalSupply'
    ),
    []
);
```
