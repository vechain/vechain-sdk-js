---
title: Dynamic Fee Estimation in VeChain Thor
description: How to use fee estimation endpoints introduced in the Galactica hardfork
---

# Dynamic Fee Estimation

The Galactica hardfork introduced dynamic gas fees to VeChain Thor, similar to Ethereum's EIP-1559 fee market. This guide explains how to use the new fee estimation endpoints to create transactions with appropriate fee parameters.

## Fee Estimation Endpoints

Two key endpoints are available for fee estimation:

1. `getMaxPriorityFeePerGas()`: Returns the suggested priority fee based on recent network conditions
2. `getFeeHistory()`: Returns historical fee data to help determine appropriate fee values

## Example Usage

This example demonstrates how to use these endpoints to retrieve current fee information and apply it to a transaction:

```typescript { name=fee-estimation, category=example }
import { ThorClient, THOR_SOLO_URL } from '@vechain/sdk-network';
import { Transaction, Address, VET, Clause, networkInfo } from '@vechain/sdk-core';
import type { TransactionBody } from '@vechain/sdk-core';

// Create thor client
const thorClient = ThorClient.at(THOR_SOLO_URL);

// 1. Get suggested priority fee
let suggestedPriorityFee = '0x746a528800'; // Default 500 Gwei
try {
    suggestedPriorityFee = await thorClient.gas.getMaxPriorityFeePerGas();
    console.log('Suggested priority fee (hex):', suggestedPriorityFee);
    console.log('Suggested priority fee (Gwei):', parseInt(suggestedPriorityFee, 16) / 1e9);
} catch (error) {
    console.log('Using default priority fee:', parseInt(suggestedPriorityFee, 16) / 1e9, 'Gwei');
}

// 2. Get fee history for recent blocks
let currentBaseFee = '0x9184e72a000'; // Default 10 Gwei
try {
    const feeHistory = await thorClient.gas.getFeeHistory({
        blockCount: 10,
        newestBlock: 'best',  // Use 'best' not 'latest'
        rewardPercentiles: [25, 50, 75]  // Get 25th, 50th and 75th percentiles
    });
    
    console.log('Fee history info:');
    console.log('- Oldest block:', feeHistory.oldestBlock);
    console.log('- Number of blocks:', feeHistory.baseFeePerGas.length);
    
    // 3. Get the current base fee (most recent block)
    currentBaseFee = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];
    console.log('Current base fee (hex):', currentBaseFee);
    console.log('Current base fee (Gwei):', parseInt(currentBaseFee, 16) / 1e9);
} catch (error) {
    console.log('Using default base fee:', parseInt(currentBaseFee, 16) / 1e9, 'Gwei');
}

// 4. Calculate max fee (base fee + priority fee with buffer)
// For EIP-1559 style transactions, maxFeePerGas must be >= (baseFee + priorityFee)
const maxFeePerGas = parseInt(currentBaseFee, 16) * 2 + parseInt(suggestedPriorityFee, 16);
console.log('Max fee per gas (wei):', maxFeePerGas);
console.log('Max fee per gas (Gwei):', maxFeePerGas / 1e9);

// 5. Use these values in a transaction
const sampleTransaction: TransactionBody = {
    chainTag: networkInfo.solo.chainTag, // Example chain tag
    blockRef: '0x00000000aabbccdd',
    expiration: 32,
    clauses: [
        Clause.transferVET(
            Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
            VET.of(10000)
        )
    ],
    gas: 21000,
    dependsOn: null,
    nonce: 12345,
    // The new dynamic fee parameters:
    maxFeePerGas,
    maxPriorityFeePerGas: parseInt(suggestedPriorityFee, 16)
};

// 6. Create the transaction (would then sign and send in real usage)
const tx = Transaction.of(sampleTransaction);

// Verify this is a dynamic fee (EIP-1559) transaction
console.log('Transaction type:', tx.transactionType); // Should be 'eip1559'

// The maxFeePerGas and maxPriorityFeePerGas values are now part of the transaction
console.log('Transaction max fee per gas:', tx.body.maxFeePerGas);
console.log('Transaction max priority fee per gas:', tx.body.maxPriorityFeePerGas);
```

## Key Concepts

- **Base Fee**: Network-determined fee that adjusts based on block space demand (retrieved from fee history)
- **Priority Fee**: Additional fee that incentivizes validators to include your transaction
- **Max Fee Per Gas**: The maximum total fee (base fee + priority fee) you're willing to pay

## Best Practices

- Always use `best` (not `latest`) as the parameter for the newest block in `getFeeHistory()`
- The current base fee is the last element in the `baseFeePerGas` array from fee history
- For max fee calculation, a common approach is `2 × baseFee + priorityFee` to allow for base fee fluctuations
- Set appropriate priority fees based on transaction urgency

For more detailed information about dynamic fee transactions, see the [Dynamic Fee Transactions guide](./dynamic-fee-transactions.md). 