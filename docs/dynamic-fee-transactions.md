---
title: Dynamic Fee Transactions (EIP-1559)
description: How to create and send transactions with dynamic fee parameters on VeChain Thor
---

# Dynamic Fee Transactions

This guide explains how to create and send transactions with dynamic fee parameters (EIP-1559 style) on VeChain Thor.

## Introduction

VeChain Thor supports dynamic fee transactions similar to Ethereum's EIP-1559 standard. These transactions allow you to:

- Set a maximum fee per gas you're willing to pay (`maxFeePerGas`)
- Set a priority fee to incentivize block producers (`maxPriorityFeePerGas`)
- Let the network determine the actual fee based on current network conditions

Dynamic fee transactions provide better fee estimation and can help reduce overpayment for transaction fees.

## Creating a Dynamic Fee Transaction

To create a dynamic fee transaction, you need to:

1. Get the current base fee per gas from the network
2. Determine an appropriate priority fee
3. Set your maximum fee parameters
4. Create and sign the transaction
5. Send it to the network

## Example

Here's a complete example showing how to create and send a dynamic fee transaction:

```ts
{{#include ../examples/transactions/dynamic-fee-tx.ts:DynamicFeeTxSnippet}}
```

## Breaking Down the Process

1. **Setup**: Create a Thor client and define transaction clauses
2. **Fee Determination**: 
   - Query the current suggested priority fee using `thorClient.gas.getMaxPriorityFeePerGas()`
   - Get fee history information using `thorClient.gas.getFeeHistory()`
   - Extract the current base fee from the fee history (last element in the `baseFeePerGas` array)
3. **Transaction Creation**: Create a transaction body with the dynamic fee parameters:
   - `maxFeePerGas`: The maximum total fee per gas (typically 2× base fee + priority fee)
   - `maxPriorityFeePerGas`: The fee that goes to the block producer
4. **Transaction Processing**: Sign, send, and wait for confirmation of the transaction
5. **Receipt Verification**: Verify the transaction was executed successfully

## Key Considerations

- The `maxFeePerGas` must be greater than or equal to the `maxPriorityFeePerGas` plus the current base fee
- Setting a higher priority fee can help your transaction get processed faster during network congestion
- The actual fee paid will be the base fee plus your priority fee, but never more than your `maxFeePerGas`
- Always check the transaction receipt to confirm it was processed without reverting 
