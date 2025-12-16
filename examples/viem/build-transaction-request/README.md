# Build Transaction Request (viem)

This example demonstrates building and sending transactions using viem-compatible clients.

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/build-transaction-request)

## Usage

```bash
yarn dev
```

or

```bash
tsx index.ts
```

## viem Features Used

This example uses the following viem-compatible APIs from `@vechain/sdk-temp/viem`:

| Function | Description |
|----------|-------------|
| `createPublicClient` | Creates a viem-compatible public client for reading blockchain data |
| `createWalletClient` | Creates a viem-compatible wallet client for signing and sending transactions |
| `privateKeyToAccount` | Converts a private key to a viem-compatible account |

### PublicClient Methods

- `estimateGas(clauses, sender, options)` - Estimates gas required for transaction clauses
- `waitForTransactionReceipt(txId)` - Waits for a transaction to be confirmed and returns the receipt

### WalletClient Methods

- `sendTransaction(txBody)` - Signs and broadcasts a transaction to the network
- `getAddresses()` - Returns the addresses associated with the wallet

## What it demonstrates

- How to create viem-compatible `PublicClient` and `WalletClient`
- How to use `privateKeyToAccount` for wallet authentication
- How to estimate gas using `publicClient.estimateGas()`
- How to build transactions using `TransactionBuilder` or `buildTransactionBody()`
- How to sign and send transactions via `walletClient.sendTransaction()`
- How to wait for confirmation via `publicClient.waitForTransactionReceipt()`
