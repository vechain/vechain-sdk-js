---
title: Dynamic Fee Transactions (EIP-1559)
description: How to create and send transactions with dynamic fee parameters on VeChain Thor
---

```ts
import {
    Address,
    Clause,
    HexUInt,
    Transaction,
    TransactionType,
    VET,
    networkInfo,
    type TransactionBody,
    type TransactionClause
} from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
```

# Dynamic Fee Transactions

The Galactica hardfork introduces dynamic gas fees to the VeChain blockchain, similar to Ethereum's EIP-1559 fee market. This enhancement allows transactions to include `maxFeePerGas` and `maxPriorityFeePerGas` parameters, providing more predictable transaction fees and a better user experience.

## Understanding Dynamic Fees

Dynamic fees consist of two components:

- **Base Fee**: A network-determined fee that fluctuates based on network congestion. This fee is burned.
- **Priority Fee**: A fee paid to validators as an incentive to include your transaction. You can set this based on how quickly you want your transaction processed.

### Total Transaction Fee Calculation

The total transaction fee is calculated as:
```
Total Fee = Gas Used × Effective Gas Price
```

Where the effective gas price is the minimum of:
- `maxFeePerGas` (your maximum willingness to pay)
- `baseFee + maxPriorityFeePerGas` (the current network base fee plus your priority fee)

## Using Dynamic Fee Endpoints

The SDK provides two new endpoints to support dynamic fees:

1. `getMaxPriorityFeePerGas()`: Returns the suggested priority fee based on recent network conditions.
2. `getFeeHistory()`: Returns historical fee data to help estimate appropriate fee values.

### Step-by-Step Process

1. Get the suggested priority fee from the network
2. Retrieve fee history data
3. Extract the current base fee from the most recent block
4. Calculate a reasonable maximum fee
5. Use these values in your transaction
6. Create and sign the transaction
7. Send it to the network

### Example: Fee Estimation

This example demonstrates how to get the current fee information and calculate appropriate values:

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

### Example: Creating a Dynamic Fee Transaction

This example shows how to create and sign a transaction with dynamic fees:

```typescript { name=dynamic-fee-transaction, category=example }
import {
    Address,
    Clause,
    HexUInt,
    Transaction,
    TransactionType,
    VET,
    networkInfo,
    type TransactionBody,
    type TransactionClause
} from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';

// Sample account with private key
const senderAccount = {
    privateKey:
        'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
    address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
};

// 1 - Create thor client for solo network
const thorClient = ThorClient.at(THOR_SOLO_URL, {
    isPollingEnabled: false
});

// 2 - Define a clause for the transaction
const clauses: TransactionClause[] = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(10000)
    ) as TransactionClause
];

// 3 - Get the latest suggested priority fee from the node
let suggestedPriorityFee = '0x746a528800'; // Default 500 Gwei
try {
    suggestedPriorityFee = await thorClient.gas.getMaxPriorityFeePerGas();
    console.log('Suggested priority fee:', suggestedPriorityFee);
} catch (error) {
    console.log('Using default priority fee:', parseInt(suggestedPriorityFee, 16) / 1e9, 'Gwei');
}

// 4 - Get fee history to determine base fee
let baseFeePerGas = '0x9184e72a000'; // Default 10 Gwei
try {
    const feeHistory = await thorClient.gas.getFeeHistory({
        blockCount: 10,
        newestBlock: 'best',
        rewardPercentiles: [25, 50, 75]
    });
    
    // Get the most recent base fee (last element in the array)
    baseFeePerGas = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];
    console.log('Current base fee per gas:', baseFeePerGas);
} catch (error) {
    console.log('Using default base fee:', parseInt(baseFeePerGas, 16) / 1e9, 'Gwei');
}

// 5 - Get the estimated gas for the transaction
let gasEstimate = 21000; // Default gas for simple transfers
try {
    const gasResult = await thorClient.gas.estimateGas(
        clauses,
        senderAccount.address
    );
    gasEstimate = gasResult.totalGas || gasEstimate;
} catch (error) {
    console.log('Using default gas value:', gasEstimate);
}

// 6 - Get latest block for block reference
let blockRef = '0x0000000000000000';
try {
    const latestBlock = await thorClient.blocks.getBestBlockCompressed();
    if (latestBlock?.id) {
        blockRef = latestBlock.id.slice(0, 18);
    }
} catch (error) {
    console.log('Using default block reference');
}

// 7 - Define transaction body with dynamic fee parameters
const body: TransactionBody = {
    chainTag: networkInfo.solo.chainTag,
    blockRef,
    expiration: 32,
    clauses,
    gas: gasEstimate,
    dependsOn: null,
    nonce: Math.floor(Math.random() * 1000000),
    // These fields make it a dynamic fee transaction
    maxFeePerGas: parseInt(baseFeePerGas, 16) * 2 + parseInt(suggestedPriorityFee, 16),
    maxPriorityFeePerGas: parseInt(suggestedPriorityFee, 16)
};

// 8 - Create transaction and sign it
const privateKey = HexUInt.of(senderAccount.privateKey).bytes;
const signedTransaction = Transaction.of(body).sign(privateKey);

// 9 - Verify this is an EIP1559 transaction
console.log('Transaction type:', signedTransaction.transactionType);

// 10 - Encode transaction for sending
const encodedRaw = signedTransaction.encoded;

// In a real scenario, you would send the transaction and wait for receipt
console.log('Transaction ready to send');
console.log('- Max fee per gas:', body.maxFeePerGas);
console.log('- Max priority fee per gas:', body.maxPriorityFeePerGas);

// 11 - Send the transaction (commented for example purposes)
// const txResponse = await thorClient.transactions.sendRawTransaction(
//     HexUInt.of(encodedRaw).toString()
// );

// 12 - Wait for transaction confirmation and check receipt
// const receipt = await thorClient.transactions.waitForTransaction(txResponse.id);
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

## Benefits of Dynamic Fees

- **Fee Predictability**: With base fees adjusting based on network conditions, users can better predict transaction costs.
- **Transaction Priority**: Users can express urgency by adjusting their priority fee.
- **Fee Stability**: The burning of base fees provides a more stable fee market over time.
- **Improved User Experience**: Fewer stuck transactions due to inadequate fees.

For more detailed examples, refer to the example files included in the SDK. 