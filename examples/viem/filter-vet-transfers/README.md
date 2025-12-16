# Filter VET Transfers (viem)

This example demonstrates filtering native VET transfers using viem-compatible APIs.

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/filter-vet-transfers)

## Usage

```bash
yarn dev
```

or

```bash
tsx index.ts
```

## viem Features Used

### From `@vechain/sdk-temp/viem`

| Function | Description |
|----------|-------------|
| `createPublicClient` | Creates a viem-compatible public client for reading blockchain data |

### PublicClient Methods

- `getBlockNumber()` - Gets the current block number
- `getTransferLogs(filter)` - Filters native VET transfers (VeChain-specific)

### Types from `@vechain/sdk-temp/thor`

| Type | Description |
|------|-------------|
| `TransferLog` | Represents a VET transfer with sender, recipient, amount, and metadata |
| `ThorNetworks` | Enum for VeChain network endpoints |

## What it demonstrates

- How to create a viem-compatible `PublicClient`
- How to get the current block number via `publicClient.getBlockNumber()`
- How to filter VET transfers via `publicClient.getTransferLogs()`
- Filtering VET transfers by block range (~24 hours)
- Pagination of VET transfers using offset and limit
- Filtering VET transfers by recipient address

## Note

VET is the native token of VeChain (similar to ETH on Ethereum). The `getTransferLogs` method is a VeChain-specific extension to the viem-compatible PublicClient that enables filtering native token transfers.
