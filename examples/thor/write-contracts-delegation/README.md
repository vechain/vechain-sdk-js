# Write Contracts with Delegation Example

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/write-contracts-delegation)

This example demonstrates:

- How to use fee delegation (VIP-191) with an external sponsor service
- How to build a delegated transaction with `TransactionBuilder`
- How to call a smart contract function using `ClauseBuilder.callFunction`
- The complete flow of a sponsored/delegated transaction

## Key Concepts

### Fee Delegation (VIP-191)

VeChain's fee delegation allows a third party (sponsor) to pay the gas fees for a transaction. This is useful for:

- Onboarding new users who don't have VTHO
- Gasless transactions for dApps
- Sponsored transactions

### Transaction Flow

1. **Build transaction** with `.withDelegatedFee()` - marks the transaction as delegated
2. **Sign as origin** - The sender signs the transaction first
3. **Send to sponsor** - Request the sponsor's signature from the service
4. **Combine signatures** - Merge sender and sponsor signatures
5. **Broadcast** - Send the fully signed transaction to the network

### TransactionBuilder

The `TransactionBuilder` provides a fluent API to construct transactions:

- `.withClauses()` - Add transaction clauses
- `.withDelegatedFee()` - Enable fee delegation (VIP-191)
- `.withLegacyTxDefaults()` - Use legacy transaction format (for sponsor compatibility)
- `.withEstimatedGas()` - Automatically estimate gas
- `.build()` - Build the final transaction request

### ClauseBuilder

`ClauseBuilder.callFunction` is used to encode a smart contract function call with:

- Contract address
- ABI definition
- Function name
- Arguments
- Value to send (in wei)

## Running the Example

```bash
yarn install
yarn dev
```

> **Note**: This example generates a new wallet each time. The sponsor service at `sponsor-testnet.vechain.energy` is used for testnet fee delegation.
