---
description: Returns the current price of gas (in wei).
---

# getGasPrice

Returns the current price of gas (in wei).

## Usage

:::code-group

```js twoslash [example.ts]
import { publicClient } from './client';

const gasPrice = await publicClient.getGasPrice(); // [!code focus:4]
```

```js twoslash [client.ts] filename="client.ts"
import { createPublicClient, ThorNetworks } from '@vechain/sdk/viem';


export const publicClient = createPublicClient({
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

:::

## Returns

`bigint`

The gas price (in wei).

## JSON-RPC Method

[`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)
