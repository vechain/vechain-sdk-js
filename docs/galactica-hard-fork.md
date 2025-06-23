---
description: Implementation of EIP-1559 transaction fee mechanism in VeChain Thor's Galactica hard fork
---

# Galactica Hard Fork: EIP-1559 Transaction Fee Mechanism

This guide explains the implementation of EIP-1559 transaction fee mechanism in VeChain Thor's Galactica hard fork. The implementation combines EIP-1559's base fee and priority fee model with VeChain's unique features.

## Introduction

The Galactica hard fork introduces EIP-1559 transaction fee mechanism that:

- Supports EIP-1559 style dynamic fee transactions
- Provides accurate fee estimation through new RPC endpoints
- Maintains backward compatibility with legacy transactions
- Offers flexible fee control for different use cases

## Understanding the Fee Mechanism

### Key Components

1. **Base Fee**
   - Set by the network based on block space demand
   - Automatically adjusts to maintain target block utilization
   - Burned after transaction processing

2. **Priority Fee**
   - Additional fee paid to validators
   - Incentivizes transaction inclusion
   - Set by the transaction sender

3. **Maximum Fee**
   - Upper limit for total fee payment
   - Protects against sudden fee spikes
   - Must cover base fee + priority fee

### Fee Parameters

When creating a transaction, you can specify:

- `maxFeePerGas`: Maximum total fee per gas unit
- `maxPriorityFeePerGas`: Additional fee for validators
- `gasPrice`: Legacy parameter (optional)

## Fee Estimation

The Galactica hard fork introduces new RPC endpoints for accurate fee estimation:

### 1. Get Current Priority Fee

```typescript { name=fee-estimation, category=example }
// Query the current max priority fee per gas
const maxPriorityFee = await thor.gas.getMaxPriorityFeePerGas();
```

### 2. Get Fee History

```typescript { name=fee-estimation, category=example }
// Query the recent fee history
const feeHistory = await thor.gas.getFeeHistory({
    blockCount: 10,
    newestBlock: 'best'
});
```

### 3. Get Current Base Fee

```typescript { name=fee-estimation, category=example }
// Query the current base fee per gas
const baseFee = await thor.blocks.getBestBlockBaseFeePerGas();
```

## Creating Transactions

### Default Case (Recommended)

Let the SDK handle fee estimation:

```typescript { name=dynamic-fee-tx-default, category=example }
// 1 - Create thor client for solo network
const thorClient = ThorClient.at(THOR_SOLO_URL);

// 2 - Derive account from mnemonic
const mnemonic =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const hdKey = HDKey.fromMnemonic(mnemonic.split(' '));
const privateKey = hdKey.privateKey;
const address = Address.ofPublicKey(hdKey.publicKey).toString();

// 3 - Create transaction clauses
const clauses = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(10)
    )
];

// 4 - Estimate gas and get default body options
const gasResult = await thorClient.gas.estimateGas(clauses, address);
const defaultBodyOptions =
    await thorClient.transactions.fillDefaultBodyOptions();

// 5 - Build transaction body with default fees
const txBody = await thorClient.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    defaultBodyOptions
);

// 6 - Sign transaction
const txClass = Transaction.of(txBody);
const txSigned = txClass.sign(privateKey);
const encodedTx = Hex.of(txSigned.encoded).toString();

// 7 - Send transaction and wait for receipt
const txId = (await thorClient.transactions.sendRawTransaction(encodedTx)).id;
const receipt = await thorClient.transactions.waitForTransaction(txId);
console.log('Receipt:', receipt);
```

### Custom Fee Cases

#### Priority Fee Only

For faster transaction processing:

```typescript { name=dynamic-fee-tx-custom, category=example }
console.log('\nCase 1: Only maxPriorityFeePerGas');
const priorityOnlyOptions = {
    ...defaultBodyOptions,
    maxPriorityFeePerGas: '0x746a528800'
};
const txBody1 = await thorClient.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    priorityOnlyOptions
);
const txClass1 = Transaction.of(txBody1);
const txSigned1 = txClass1.sign(privateKey);
const encodedTx1 = Hex.of(txSigned1.encoded).toString();
const txId1 = (await thorClient.transactions.sendRawTransaction(encodedTx1)).id;
const receipt1 = await thorClient.transactions.waitForTransaction(txId1);
console.log('Receipt:', receipt1);
```

#### Maximum Fee Only

For cost control:

```typescript { name=dynamic-fee-tx-custom, category=example }
console.log('\nCase 2: Only maxFeePerGas');
const maxOnlyOptions = {
    ...defaultBodyOptions,
    maxFeePerGas: '0x098cb8c52800'
};
const txBody2 = await thorClient.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    maxOnlyOptions
);
const txClass2 = Transaction.of(txBody2);
const txSigned2 = txClass2.sign(privateKey);
const encodedTx2 = Hex.of(txSigned2.encoded).toString();
const txId2 = (await thorClient.transactions.sendRawTransaction(encodedTx2)).id;
const receipt2 = await thorClient.transactions.waitForTransaction(txId2);
console.log('Receipt:', receipt2);
```

#### Both Custom Fees

For complete control:

```typescript { name=dynamic-fee-tx-custom, category=example }
console.log('\nCase 3: Both maxPriorityFeePerGas and maxFeePerGas');
const bothOptions = {
    ...defaultBodyOptions,
    maxPriorityFeePerGas: '0x746a528800',
    maxFeePerGas: '0x098cb8c52800'
};
const txBody3 = await thorClient.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    bothOptions
);
const txClass3 = Transaction.of(txBody3);
const txSigned3 = txClass3.sign(privateKey);
const encodedTx3 = '0x' + Buffer.from(txSigned3.encoded).toString('hex');
const txId3 = (await thorClient.transactions.sendRawTransaction(encodedTx3)).id;
const receipt3 = await thorClient.transactions.waitForTransaction(txId3);
console.log('Receipt:', receipt3);
```

## Best Practices

### 1. Fee Estimation

- Use `getMaxPriorityFeePerGas()` for current network conditions
- Monitor `getFeeHistory()` for fee trends
- Consider block utilization when setting fees

```typescript { name=fee-estimation, category=example }
// 3. Estimate gas and get default body options
const gasResult = await thor.gas.estimateGas(clauses, address);
const defaultBodyOptions = await thor.transactions.fillDefaultBodyOptions();

// 4. Build transaction body with explicit values
const txBody = await thor.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    {
        chainTag: networkInfo.solo.chainTag,
        blockRef: '0x0000000000000000',
        expiration: 32,
        gasPriceCoef: 128,
        dependsOn: null,
        nonce: 12345678,
        ...defaultBodyOptions
    }
);

// 5. Sign transaction
const txClass = Transaction.of(txBody);
const txSigned = txClass.sign(privateKey);
const encodedTx = Hex.of(txSigned.encoded).toString();

// 6. Send transaction and wait for receipt
const txId = (await thor.transactions.sendRawTransaction(encodedTx)).id;
const receipt = await thor.transactions.waitForTransaction(txId);
```

### 2. Fee Setting

- Set `maxFeePerGas` to at least 2× base fee + priority fee
- Adjust priority fees based on transaction urgency
- Use higher priority fees during network congestion

### 3. Transaction Monitoring

- Verify transaction receipts
- Monitor gas usage patterns
- Use transaction simulation for gas estimation

## Benefits of Galactica's EIP-1559 Implementation

- **Improved Predictability**: Better fee estimation
- **Fee Stability**: Reduced volatility during congestion
- **Flexible Control**: Multiple fee setting options
- **EVM Compatibility**: Aligns with Ethereum standards
- **Backward Compatibility**: Supports legacy transactions
- **Optimized UX**: Reduced overpayment risk

## Migration Guide

### From Legacy to EIP-1559

1. Update SDK to latest version
2. Replace `gasPrice` with EIP-1559 parameters
3. Use new fee estimation endpoints
4. Test with small transactions first

### Backward Compatibility

- Legacy transactions still supported
- `gasPrice` parameter still valid
- Automatic conversion to EIP-1559 parameters 
