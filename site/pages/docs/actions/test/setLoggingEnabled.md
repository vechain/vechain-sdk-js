---
description: Enable or disable logging on the test node network.
---

# setLoggingEnabled

Enable or disable logging on the test node network.

## Usage

:::code-group

```ts [example.ts]
import { testClient } from './client'
 
await testClient.setLoggingEnabled(true) // [!code focus]
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
