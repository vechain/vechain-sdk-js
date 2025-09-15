---
description: Switch the target chain in a wallet.
---

# switchChain

Switch the target chain in a wallet.

## Usage

:::code-group

```js twoslash [example.ts]
import { walletClient } from './client';

await walletClient.switchChain({ id: avalanche.id }); // [!code focus]
```

```js twoslash [client.ts] filename="client.ts"
// [!include ~/snippets/walletClient.ts]
```

:::

## Parameters

### id

- **Type:** `number`

The Chain ID.

## JSON-RPC Methods

[`wallet_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)
