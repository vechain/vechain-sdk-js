---
title: EIP-1559 Transaction Fee Mechanism (Galactica Hard Fork)
description: Implementation of EIP-1559 transaction fee mechanism in VeChain Thor's Galactica hard fork
---

# EIP-1559 Transaction Fee Mechanism

This guide explains the implementation of EIP-1559 transaction fee mechanism in VeChain Thor's Galactica hard fork. The implementation combines EIP-1559's base fee and priority fee model with VeChain's unique features.

## Introduction

The Galactica upgrade introduces a dynamic fee system that:

- Supports EIP-1559 style dynamic fee transactions
- Provides accurate fee estimation through new RPC endpoints
- Maintains backward compatibility with legacy transactions
- Offers flexible fee control for different use cases

## Understanding the Fee System

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

The Galactica upgrade introduces new RPC endpoints for accurate fee estimation:

### 1. Get Current Priority Fee

```ts
{{#include ../examples/gas/fee-estimation.ts:PriorityFeeSnippet}}
```

### 2. Get Fee History

```ts
{{#include ../examples/gas/fee-estimation.ts:FeeHistorySnippet}}
```

### 3. Get Current Base Fee

```ts
{{#include ../examples/gas/fee-estimation.ts:BaseFeeSnippet}}
```

## Creating Transactions

### Default Case (Recommended)

Let the SDK handle fee estimation:

```ts
{{#include ../examples/transactions/dynamic-fee-tx-default.ts:DynamicFeeTxDefaultSnippet}}
```

### Custom Fee Cases

#### Priority Fee Only

For faster transaction processing:

```ts
{{#include ../examples/transactions/dynamic-fee-tx-custom.ts:DynamicFeeTxPriorityOnlySnippet}}
```

#### Maximum Fee Only

For cost control:

```ts
{{#include ../examples/transactions/dynamic-fee-tx-custom.ts:DynamicFeeTxMaxOnlySnippet}}
```

#### Both Custom Fees

For complete control:

```ts
{{#include ../examples/transactions/dynamic-fee-tx-custom.ts:DynamicFeeTxBothSnippet}}
```

## Best Practices

### 1. Fee Estimation

- Use `getMaxPriorityFeePerGas()` for current network conditions
- Monitor `getFeeHistory()` for fee trends
- Consider block utilization when setting fees

### 2. Fee Setting

- Set `maxFeePerGas` to at least 2× base fee + priority fee
- Adjust priority fees based on transaction urgency
- Use higher priority fees during network congestion

### 3. Transaction Monitoring

- Verify transaction receipts
- Monitor gas usage patterns
- Use transaction simulation for gas estimation

## Benefits of Galactica's Fee System

- **Improved Predictability**: Better fee estimation
- **Fee Stability**: Reduced volatility during congestion
- **Flexible Control**: Multiple fee setting options
- **EVM Compatibility**: Aligns with Ethereum standards
- **Backward Compatibility**: Supports legacy transactions
- **Optimized UX**: Reduced overpayment risk

## Migration Guide

### From Legacy to Dynamic Fees

1. Update SDK to latest version
2. Replace `gasPrice` with dynamic fee parameters
3. Use new fee estimation endpoints
4. Test with small transactions first

### Backward Compatibility

- Legacy transactions still supported
- `gasPrice` parameter still valid
- Automatic conversion to dynamic fees 
