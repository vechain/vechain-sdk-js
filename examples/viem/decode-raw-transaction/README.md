# Decode Raw Transaction

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/decode-raw-transaction)

## Usage

```bash
yarn dev
```

or

```bash
tsx index.ts
```

## What it demonstrates

This example demonstrates how to decode a raw transaction. A raw transaction is a RLP encoded transaction, often represented as a hexadecimal string. Decoding the transaction returns a `TransactionRequest` object, whos properties can be inspected.

