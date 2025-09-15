---
description: Returns the chain ID associated with the current network
---

# getChainId

Returns the chain ID associated with the current network

## Usage

:::code-group

```js twoslash [example.ts]
import { publicClient } from './client';

const chainId = await publicClient.getChainId(); // [!code focus:99]
// @log: 1
```

```ts [client.ts] filename="client.ts"
import { createPublicClient, ThorNetworks } from '@vechain/sdk/viem';


export const publicClient = createPublicClient({
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

:::

## Returns

`number`

The current chain ID.

## JSON-RPC Method

- Calls [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid).
