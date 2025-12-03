# Contract Deploy Example

This example demonstrates how to deploy a smart contract to VeChain Thor network using SDK v3.

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/contract-deploy-example)

## Usage

```bash
yarn dev
```

or

```bash
tsx index.ts
```

## What it demonstrates

1. **Setup network configuration** - Configure testnet or mainnet
2. **Create ThorClient and Signer** - Initialize client and private key signer
3. **Prepare contract bytecode and ABI** - Load contract artifacts
4. **Create deployment clause** - Use `ClauseBuilder.deployContract()` to create deployment clause
5. **Deploy contract** - Execute the deployment transaction and wait for receipt
6. **Extract contract address** - Get the deployed contract address from transaction receipt

## Configuration

You can change the network by modifying the `network` variable in `index.ts`:
- `'testnet'` - Deploy to VeChain testnet
- `'mainnet'` - Deploy to VeChain mainnet

**Note**: Make sure the account has sufficient VET to pay for gas fees.
