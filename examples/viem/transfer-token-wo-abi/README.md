# Transfer Token Without ABI Example

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/transfer-token-wo-abi)

This example demonstrates:

* How to transfer VIP-180/ERC-20 tokens without needing to define an ABI
* How to use `ClauseBuilder.transferToken` for token transfers
* How to sign and send transactions using `PrivateKeySigner`
* How to wait for transaction confirmation

## Key Concepts

### Token Transfer Without ABI
The example uses `ClauseBuilder.transferToken` which handles the encoding of the standard ERC-20/VIP-180 `transfer` function call internally. No ABI definition is required.

### Signer
`PrivateKeySigner` is used to sign the transaction with a private key.

### Transaction Execution
`thorClient.transactions.executeClauses` handles:
1. Gas estimation
2. Transaction body building
3. Transaction signing
4. Sending to the network

## Running the Example

```bash
yarn install
yarn dev
```

> **Note**: Make sure the sender address has enough VET for gas and tokens to transfer.

