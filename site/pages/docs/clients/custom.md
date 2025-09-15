# Build your own Client

You can build your own viem Client by using the `createClient` function and optionally extending (`.extend`) it – this is how viem's internal Clients ([Public](/docs/clients/public), [Wallet](/docs/clients/wallet), and [Test](/docs/clients/test)) are built.

Building your own Client is useful if you have specific requirements for how the Client should behave, and if you want to extend that Client with custom functionality (ie. create a [geth Debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug) Client).

The `createClient` function sets up a base viem Client with a given [Transport](/docs/clients/intro) configured with a [Chain](/docs/chains/introduction). After that, you can extend the Client with custom properties (that could be Actions or other configuration).

## Import

```js twoslash
import { createClient } from 'viem';
```

## Usage

Initialize a Client with your desired [Chain](/docs/chains/introduction) (e.g. `mainnet`) and [Transport](/docs/clients/intro) (e.g. `http`).

```js twoslash
import { createClient, http } from 'viem';


const client = createClient({
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

Next, you can either [extend your Client with Actions or configuration](#extending-with-actions-or-configuration), or you can use it as-is for the purpose of [maximizing tree-shaking in your app](#tree-shaking).

### Extending with Actions or configuration

You can extend your Client with custom Actions or configuration by using the `.extend` function.

Below is a naive implementation of implementing a [geth Debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug) Client with a `traceCall` Action that uses the `debug_traceCall` RPC method.

```js twoslash {12-21,23-29}
// @noErrors
import {
  createClient,
  http,
  formatTransactionRequest,
  type CallParameters
} from 'viem'

const debugClient = createClient({
  network: ThorNetworks.MAINNET,
  network: ThorNetworks.MAINNET,
}).extend(client => ({
  // ...
  async traceCall(args: CallParameters) {
    return client.request({
      method: 'debug_traceCall',
      params: [formatTransactionRequest(args), 'latest', {}]
    })
  },
  // ...
}))

const response = await debugClient.traceCall({
  account: '0xdeadbeef29292929192939494959594933929292',
  to: '0xde929f939d939d393f939393f93939f393929023',
  gas: 69420n,
  data: '0xf00d4b5d00000000000000000000000001291230982139282304923482304912923823920000000000000000000000001293123098123928310239129839291010293810'
})
// { failed: false, gas: 69420, returnValue: '...', structLogs: [] }
```

For a more succinct implementation of using `.extend`, check out viem's [Public Client implementation](https://github.com/wagmi-dev/viem/blob/29c053f5069a5b44e3791972c221368a2c71a254/src/clients/createPublicClient.ts#L48-L68) extended with [Public Actions](https://github.com/wagmi-dev/viem/blob/29c053f5069a5b44e3791972c221368a2c71a254/src/clients/decorators/public.ts#L1377-L1425).

### Tree-shaking

You can use the Client as-is, with no decorated Actions, to maximize tree-shaking in your app. This is useful if you are pedantic about bundle size and want to only include the Actions you use.

In the example below, instead of calling `getBlock` from the Public Client, we are importing the Action directly from `viem` and then injecting our Client as the first parameter to the Action.

```js twoslash {3,10-11}
// @noErrors
import { createClient, http } from 'viem'
import { getBlock, sendTransaction } from 'viem/actions'

const client = createClient({
  network: ThorNetworks.MAINNET,
  network: ThorNetworks.MAINNET
})

const blockNumber = await getBlock(client, { blockTag: 'latest' })
const hash = await sendTransaction(client, { ... })
```

## Parameters

### transport

- **Type:** [Transport](/docs/glossary/types#transport)

The [Transport](/docs/clients/intro) of the Public Client.

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
const client = createClient({
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET // [!code focus]
});
```

### account (optional)

- **Type:** `Account | Address`

The Account to use for the Client. This will be used for Actions that require an `account` as an argument.

Accepts a [JSON-RPC Account](/docs/accounts/jsonRpc) or [Local Account (Private Key, etc)](/docs/accounts/local/privateKeyToAccount).

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
import { privateKeyToAccount } from 'viem/accounts';

const client = createClient({
    account: privateKeyToAccount('0x...'), // [!code focus]
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

### chain (optional)

- **Type:** [Chain](/docs/glossary/types#chain)

The [Chain](/docs/chains/introduction) of the Public Client.

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
const client = createClient({
    network: ThorNetworks.MAINNET, // [!code focus]
    network: ThorNetworks.MAINNET
});
```

### batch (optional)

Flags for batch settings.

### batch.multicall (optional)

- **Type:** `boolean | MulticallBatchOptions`
- **Default:** `false`

Toggle to enable `eth_call` multicall aggregation.

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
const client = createClient({
    batch: {
        multicall: true // [!code focus]
    },
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

### batch.multicall.batchSize (optional)

- **Type:** `number`
- **Default:** `1_024`

The maximum size (in bytes) for each multicall (`aggregate3`) calldata chunk.

> Note: Some RPC Providers limit the amount of calldata that can be sent in a single request. It is best to check with your RPC Provider to see if there are any calldata size limits to `eth_call` requests.

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
const client = createClient({
    batch: {
        multicall: {
            batchSize: 512 // [!code focus]
        }
    },
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

### batch.multicall.wait (optional)

- **Type:** `number`
- **Default:** `0` ([zero delay](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop#zero_delays))

The maximum number of milliseconds to wait before sending a batch.

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
const client = createClient({
    batch: {
        multicall: {
            wait: 16 // [!code focus]
        }
    },
    network: ThorNetworks.MAINNET,
    network: ThorNetworks.MAINNET
});
```

### key (optional)

- **Type:** `string`
- **Default:** `"public"`

A key for the Client.

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
const client = createClient({
    network: ThorNetworks.MAINNET,
    key: 'public', // [!code focus]
    network: ThorNetworks.MAINNET
});
```

### name (optional)

- **Type:** `string`
- **Default:** `"Public Client"`

A name for the Client.

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
const client = createClient({
    network: ThorNetworks.MAINNET,
    name: 'Public Client', // [!code focus]
    network: ThorNetworks.MAINNET
});
```

### pollingInterval (optional)

- **Type:** `number`
- **Default:** `4_000`

Frequency (in ms) for polling enabled Actions.

```js twoslash
import { createClient, http } from 'viem';

// ---cut---
const client = createClient({
    network: ThorNetworks.MAINNET,
    pollingInterval: 10_000, // [!code focus]
    network: ThorNetworks.MAINNET
});
```

### rpcSchema (optional)

- **Type:** `RpcSchema`
- **Default:** `WalletRpcSchema`

Typed JSON-RPC schema for the client.

```js twoslash
import { createClient, http } from 'viem'
// @noErrors
// ---cut---
import { rpcSchema } from 'viem'

type CustomRpcSchema = [{ // [!code focus]
  Method: 'eth_wagmi', // [!code focus]
  Parameters: [string] // [!code focus]
  ReturnType: string // [!code focus]
}] // [!code focus]

const client = createClient({
  network: ThorNetworks.MAINNET,
  rpcSchema: rpcSchema<CustomRpcSchema>(), // [!code focus]
  network: ThorNetworks.MAINNET
})

const result = await client.request({ // [!code focus]
  method: 'eth_wa // [!code focus]
//               ^|
  params: ['hello'], // [!code focus]
}) // [!code focus]
```
