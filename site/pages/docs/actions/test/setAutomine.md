---
description: Enables or disables the automatic mining of new blocks with each new transaction submitted to the network.
---

# setAutomine

Enables or disables the automatic mining of new blocks with each new transaction submitted to the network.

## Usage

:::code-group

```ts [example.ts]
import { testClient } from './client'

await testClient.setAutomine(true) // [!code focus]
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

## Parameters

### enabled

- **Type:** `boolean`

```ts
await testClient.setAutomine(false) // [!code focus]
```