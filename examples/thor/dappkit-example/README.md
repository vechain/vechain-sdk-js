# DappKit Example

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/dappkit-example)

## Usage

```bash
yarn dev
```

## What it demonstrates

* Creating a TransactionRequest using this version of the SDK
* Adapting the TransactionRequest to a format that can be sent to dapp-kit for signing

## Technical Notes

This example uses DappKit v2, that is based on VeChain SDK v2. The type `TransactionRequest` was introduced in SDK v3, and hence needs adapting to a `TransactionRequestInput` to be compatible with SDK v2 and Dappkit v2. The `toTransactionRequestInput` function demonstrates how to do that.


