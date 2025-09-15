---
description: Reads the EIP-712 domain from a contract.
---

# getEip712Domain

Reads the EIP-712 domain from a contract, based on the [ERC-5267 specification](https://eips.ethereum.org/EIPS/eip-5267).

## Usage

:::code-group

```js twoslash [example.ts]
import { publicClient } from './client';

const { domain, extensions, fields } = await publicClient.getEip712Domain({
    address: '0x57ba3ec8df619d4d243ce439551cce713bb17411'
});
```

```ts [client.ts] filename="client.ts"
import { createPublicClient, ThorNetworks } from '@vechain/sdk/viem';


export const publicClient = createPublicClient({
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

:::

### Counterfactual Call

It is possible to read the EIP-712 domain on a contract that **has not been deployed** by providing deployment factory (`factory` + `factoryData`) parameters:

:::code-group

```js twoslash [example.ts]
import { factory, publicClient } from './config';

const { domain, extensions, fields } = await publicClient.getEip712Domain({
    address: '0x57ba3ec8df619d4d243ce439551cce713bb17411',
    factory: factory.address,
    factoryData: encodeFunctionData({
        abi: factory.abi,
        functionName: 'createAccount',
        args: ['0x0000000000000000000000000000000000000000', 0n]
    })
});
```

```ts [client.ts] filename="config.ts"
import { createPublicClient, http, parseAbi } from 'viem';


export const factory = {
    address: '0xE8Df82fA4E10e6A12a9Dab552bceA2acd26De9bb',
    abi: parseAbi(['function createAccount(address owner, uint256 salt)'])
} as const;

export const publicClient = createPublicClient({
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

:::

## Returns

`GetEip712DomainReturnType`

The EIP-712 domain (`domain`) for the contract, with `fields` and `extensions`, as per [ERC-5267](https://eips.ethereum.org/EIPS/eip-5267).

## Parameters

### address

- **Type:** `string`

The address of the contract to read the EIP-712 domain from.

```js twoslash
// [!include ~/snippets/publicClient.ts]
// ---cut---
const result = await publicClient.getEip712Domain({
    address: '0x57ba3ec8df619d4d243ce439551cce713bb17411' // [!code focus]
});
```

### factory (optional)

- **Type:**

Contract deployment factory address (ie. Create2 factory, Smart Account factory, etc).

```js twoslash
// [!include ~/snippets/publicClient.ts]
// ---cut---
const result = await publicClient.getEip712Domain({
    address: '0x57ba3ec8df619d4d243ce439551cce713bb17411',
    factory: '0xE8Df82fA4E10e6A12a9Dab552bceA2acd26De9bb', // [!code focus]
    factoryData: '0xdeadbeef'
});
```

### factoryData (optional)

- **Type:**

Calldata to execute on the factory to deploy the contract.

```js twoslash
// [!include ~/snippets/publicClient.ts]
// ---cut---
const result = await publicClient.getEip712Domain({
    address: '0x57ba3ec8df619d4d243ce439551cce713bb17411',
    factory: '0xE8Df82fA4E10e6A12a9Dab552bceA2acd26De9bb',
    factoryData: '0xdeadbeef' // [!code focus]
});
```
