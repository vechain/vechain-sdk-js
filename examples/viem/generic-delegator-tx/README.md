# Generic Delegator Fee Sponsorship Example

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/generic-delegator-tx)

This example demonstrates how to use the generic delegator service to sponsor gas costs using **VET** or **B3TR** tokens.

This example demonstrates:

- How to build a Thor transaction with fee delegation using `TransactionBuilder`
- How to call the public generic delegator API to sponsor gas costs with VET or B3TR (VIP-191)
- How to combine the origin signature with the delegator signature and broadcast the final transaction

## Key Concepts

### Generic Delegator
The generic delegator (`https://<network>.delegator.vechain.org`) accepts an unsigned transaction, appends a final payment clause (VET or B3TR token transfer) and returns a gas-payer signature. The example shows how to request that signature and combine it with the origin signature.

### Token Selection
You can choose which token to use for fee payment by setting the `TOKEN` constant in `index.ts`:
- `'vet'` - Pay gas fees with VET
- `'b3tr'` - Pay gas fees with B3TR

### Signature Combination (VIP-191)
`TransactionRequest` stores signatures as a single byte array. To broadcast a fully sponsored transaction we:
1. Decode the delegator's raw transaction (which includes the payment clause)
2. Sign it as the origin
3. Combine origin + delegator signatures
4. Create the final signed transaction

## Running the Example

```bash
yarn install
yarn dev
```

> **Note**: Replace the sample private key/address with your own funded account before running on mainnet/testnet. Make sure the account has enough of the chosen token (VET or B3TR) to pay for the gas fees. You can change the `TOKEN` constant in `index.ts` to switch between VET and B3TR.
