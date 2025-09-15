# createBlockFilter [An Action for creating a new Block Filter.]

Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](/docs/actions/public/getFilterChanges).

## Usage

:::code-group

```js twoslash [example.ts]
import { publicClient } from './client';

const filter = await publicClient.createBlockFilter(); // [!code focus:99]
// @log: { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
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

[`Filter`](/docs/glossary/types#filter)

## JSON-RPC Methods

[`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)
