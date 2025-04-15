---
title: Dynamic Gas Fee Market
description: How to use the new dynamic fee endpoints in VeChain Thor's Galactica upgrade
---

# Dynamic Gas Fee Market

VeChain Thor now supports a dynamic gas fee market modeled on Ethereum's EIP-1559. This enhancement helps secure the network, combat congestion, and deliver an improved user experience.

## Understanding Dynamic Fees

Dynamic fee transactions have two key parameters:

- **Base Fee**: Set by the network based on demand for block space
- **Priority Fee**: An additional fee paid to validators to incentivize transaction inclusion

When creating a transaction, you specify:

- `maxFeePerGas`: The maximum total fee (base fee + priority fee) you're willing to pay
- `maxPriorityFeePerGas`: The additional fee you're willing to pay to validators

## Using Dynamic Fee Endpoints

The VeChain SDK provides two key endpoints to help with fee estimation:

1. `getMaxPriorityFeePerGas()`: Get the network's suggested priority fee
2. `getFeeHistory()`: Get historical fee data for recent blocks

## Example Usage

Here's a straightforward example showing how to use these endpoints:

```ts
{{#include ../examples/gas/fee-estimation.ts:FeeEstimationSnippet}}
```

## Step-by-Step Process

1. **Get the Current Suggested Priority Fee**
   ```ts
   const suggestedPriorityFee = await thorClient.gas.getMaxPriorityFeePerGas();
   ```

2. **Get Historical Fee Data**
   ```ts
   const feeHistory = await thorClient.gas.getFeeHistory({
     blockCount: 10,
     newestBlock: 'best',
     rewardPercentiles: [25, 50, 75]  // Optional
   });
   ```

3. **Extract the Current Base Fee**
   ```ts
   const currentBaseFee = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];
   ```

4. **Calculate Maximum Fee**
   ```ts
   // Set max fee to 2x base fee + priority fee
   const maxFeePerGas = parseInt(currentBaseFee, 16) * 2 + parseInt(suggestedPriorityFee, 16);
   ```

5. **Use These Values in Your Transaction**
   ```ts
   const transaction = {
     // Other transaction parameters...
     maxFeePerGas: maxFeePerGas,
     maxPriorityFeePerGas: parseInt(suggestedPriorityFee, 16)
   };
   ```

## Benefits of Dynamic Fees

- **Fee Predictability**: Better estimate of actual gas costs
- **Fee Stability**: Reduces price volatility during network congestion
- **Transaction Prioritization**: Urgent transactions can specify higher priority fees
- **EVM Compatibility**: Aligns with Ethereum and other EVM chains
- **Improved UX**: Users are less likely to overpay for transactions 
