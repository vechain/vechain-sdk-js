---
description: Returns the current blob base fee (in wei).
---

# getBlobBaseFee

Returns the current blob base fee (in wei).

## Usage

:::code-group

```js twoslash [example.ts]
import { publicClient } from './client';

const baseFee = await publicClient.getBlobBaseFee(); // [!code focus]
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

the blob base fee (in wei).

## JSON-RPC Method

[`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)
