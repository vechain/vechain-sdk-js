---
description: Returns an estimate for the fees per gas (in wei) for a transaction to be likely included in the next block.
---

# estimateFeesPerGas

Returns an estimate for the fees per gas (in wei) for a transaction to be likely included in the next block.

If [`chain.fees.estimateFeesPerGas`](/docs/actions/public/estimateFeesPerGas) is set on the [Client Chain](/docs/clients/public#chain-optional) or [override Chain](#chain-optional), it will use the returned value.

Otherwise, for EIP-1559 Transactions, viem will estimate the fees using a combination of the block's base fee per gas (to derive `maxFeePerGas`) + the [`estimateMaxPriorityFeePerGas` Action](/docs/actions/public/estimateMaxPriorityFeePerGas) (to derive `maxPriorityFeePerGas`). For Legacy Transactions, viem will estimate the fee based on the gas price (via the [`getGasPrice` Action](/docs/actions/public/getGasPrice)).

## Usage

:::code-group

```js twoslash [example.ts]
import { publicClient } from './client';

const { maxFeePerGas, maxPriorityFeePerGas } =
    await publicClient.estimateFeesPerGas();
// @log: {
// @log:   maxFeePerGas: 15_000_000_000n,
// @log:   maxPriorityFeePerGas: 1_000_000_000n,
// @log: }

const { gasPrice } = await publicClient.estimateFeesPerGas({
    type: 'legacy'
});
// @log: { gasPrice: 15_000_000_000n }
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

[`FeeValues`](/docs/glossary/types#feevalues)

An estimate (in wei) for the fees per gas.

## Parameters

### chain (optional)

- **Type:** [Chain](/docs/glossary/types#chain)
- **Default:** [`client.chain`](/docs/clients/public#chain-optional)

Optional Chain override. Used to infer the fees per gas from [`chain.fees.estimateFeesPerGas`](/docs/actions/public/estimateFeesPerGas).

```js twoslash
// [!include ~/snippets/publicClient.ts]
// ---cut---

const { maxFeePerGas, maxPriorityFeePerGas } =
    await publicClient.estimateFeesPerGas({
        chain: optimism // [!code focus]
    });
```

### type (optional)

- **Type:** `"legacy" | "eip1559"`
- **Default:** `"eip1559"`

```js twoslash
// [!include ~/snippets/publicClient.ts]
// ---cut---
const { gasPrice } = await publicClient.estimateFeesPerGas({
    type: 'legacy' // [!code focus]
});
```
