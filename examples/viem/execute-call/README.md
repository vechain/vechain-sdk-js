# Execute Call Example

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/execute-call)

This example demonstrates:

* How to read data from a smart contract without sending a transaction
* How to use `ABIContract` to define and work with contract ABIs
* How to use `thor.contracts.executeCall()` for read-only calls

## Key Concepts

### ABIContract
`ABIContract` is a wrapper class that helps manage contract ABIs. Key methods:
- `new ABIContract(abi)` - Create an instance from an ABI array
- `.getFunction(name)` - Get a function ABI by name
- `.getEvent(name)` - Get an event ABI by name

### executeCall
`thor.contracts.executeCall()` simulates a transaction without broadcasting it. This is useful for:
- Reading contract state (view/pure functions)
- Testing contract calls before sending
- Getting return values from contracts

### Result Format
The result object contains:
- `result.plain` - The decoded return value in a human-readable format
- `result.array` - The return values as an array
- `success` - Whether the call succeeded

## Example Contract
This example reads from the VTHO (Energy) contract at address `0x0000000000000000000000000000456e65726779`, which is a built-in VeChain contract.

## Running the Example

```bash
yarn install
yarn dev
```

## Expected Output

```
Contract Name: VeThor
```

