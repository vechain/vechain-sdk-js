---
title: Galactica Hard Fork: EIP-1559 Transaction Fee Mechanism
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

[PriorityFeeSnippet](examples/gas/fee-estimation.ts)

### 2. Get Fee History

[FeeHistorySnippet](examples/gas/fee-estimation.ts)

### 3. Get Current Base Fee

[BaseFeeSnippet](examples/gas/fee-estimation.ts)

## Creating Transactions

### Default Case (Recommended)

Let the SDK handle fee estimation:

[DynamicFeeTxDefaultSnippet](examples/transactions/dynamic-fee-tx-default.ts)

### Custom Fee Cases

#### Priority Fee Only

For faster transaction processing:

[DynamicFeeTxPriorityOnlySnippet](examples/transactions/dynamic-fee-tx-custom.ts)

#### Maximum Fee Only

For cost control:

[DynamicFeeTxMaxOnlySnippet](examples/transactions/dynamic-fee-tx-custom.ts)

#### Both Custom Fees

For complete control:

[DynamicFeeTxBothSnippet](examples/transactions/dynamic-fee-tx-custom.ts)

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