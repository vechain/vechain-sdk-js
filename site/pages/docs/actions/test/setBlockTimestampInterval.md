---
description: Sets the block's timestamp interval.
---

# setBlockTimestampInterval

Similar to [`increaseTime`](/docs/actions/test/increaseTime), but sets a block timestamp `interval`. The timestamp of future blocks will be computed as `lastBlock_timestamp` + `interval`.

## Usage

:::code-group

```ts [example.ts]
import { testClient } from './client'
 
await testClient.setBlockTimestampInterval({ // [!code focus:4]
  interval: 5
})
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

### interval

- **Type:** `number`

```ts
await testClient.setBlockTimestampInterval({
  interval: 1 // [!code focus]
})
```