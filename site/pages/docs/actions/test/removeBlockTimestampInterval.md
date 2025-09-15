---
description: Removes setBlockTimestampInterval if it exists.
---

# removeBlockTimestampInterval

Removes [`setBlockTimestampInterval`](/docs/actions/test/setBlockTimestampInterval) if it exists.

## Usage

:::code-group

```ts [example.ts]
import { testClient } from './client'

await testClient.removeBlockTimestampInterval() // [!code focus]
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

