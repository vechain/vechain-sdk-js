---
description: Returns an estimate for the max priority fee per gas (in wei) for a transaction to be likely included in the next block.
---

# estimateMaxPriorityFeePerGas

Returns an estimate for the max priority fee per gas (in wei) for a transaction to be likely included in the next block.

If [`chain.fees.defaultPriorityFee`](/docs/chains/fees#feesdefaultpriorityfee) is set on the [Client Chain](/docs/clients/public#chain-optional) or [override Chain](#chain-optional), it will use that value.

Otherwise, the Action will either call [`eth_maxPriorityFeePerGas`](https://github.com/ethereum/execution-apis/blob/fe8e13c288c592ec154ce25c534e26cb7ce0530d/src/eth/fee_market.yaml#L9-L16) (if supported) or manually calculate the max priority fee per gas based on the current block base fee per gas + gas price.

## Usage

:::code-group

```js twoslash [example.ts]
import { publicClient } from './client';

const maxPriorityFeePerGas = await publicClient.estimateMaxPriorityFeePerGas();
// @log: Output: 1_000_000_000n
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

An estimate (in wei) for the max priority fee per gas.

## Parameters

### chain (optional)

- **Type:** [Chain](/docs/glossary/types#chain)
- **Default:** [`client.chain`](/docs/clients/public#chain-optional)

Optional Chain override. Used to infer the default `maxPriorityFeePerGas` from [`chain.fees.defaultPriorityFee`](/docs/chains/fees#feesdefaultpriorityfee).

```js twoslash
// [!include ~/snippets/publicClient.ts]
// ---cut---

const maxPriorityFeePerGas = await publicClient.estimateMaxPriorityFeePerGas({
    chain: optimism // [!code focus]
});
```
