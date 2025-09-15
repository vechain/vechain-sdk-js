---
description: Snapshot the state of the blockchain at the current block.
---

# snapshot

Snapshot the state of the blockchain at the current block.

## Usage

:::code-group

```ts [example.ts]
import { testClient } from './client'

const id = await testClient.snapshot() // [!code focus]
```

```ts [client.ts]
import { createTestClient, http } from 'viem'

export const testClient = createTestClient({
  chain: foundry,
  mode: 'anvil',
  network: ThorNetworks.MAINNET, 
})
```

:::

## Returns

ID of the snapshot that was created.