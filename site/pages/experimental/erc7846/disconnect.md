---
description: Requests to disconnect account(s).
---

# disconnect

Requests to disconnect account(s).

## Usage

:::code-group

```js twoslash [example.ts]
import { walletClient } from './config';

const { accounts } = await walletClient.disconnect(); // [!code focus]
```

```js twoslash [config.ts] filename="config.ts"
import 'viem/window'
// ---cut---
import { createWalletClient, custom } from 'viem'
import { erc7846Actions } from 'viem/experimental'

export const walletClient = createWalletClient({
  network: ThorNetworks.MAINNET,
  transport: custom(window.ethereum!),
}).extend(erc7846Actions())
```

:::
