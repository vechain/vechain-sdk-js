---
description: Jump forward in time by the given amount of time, in seconds.
---

# increaseTime

Jump forward in time by the given amount of time, in seconds.

## Usage

:::code-group

```ts [example.ts]
import { testClient } from './client'

await testClient.increaseTime({ // [!code focus:4]
  seconds: 420,
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

### seconds

- **Type:** `number`

The amount of seconds to jump forward in time.

```ts
await testClient.increaseTime({
  seconds: 20, // [!code focus]
})
```