# Public Client [A function to create a Public Client]

A Public Client is an interface to "public" [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) methods such as retrieving block numbers, transactions, reading from smart contracts, etc through [Public Actions](/docs/actions/public/introduction).

The `createPublicClient` function sets up a Public Client with a given [Transport](/docs/clients/intro) configured for a [Chain](/docs/chains/introduction).

## Import

```js twoslash
import { createPublicClient } from '@vechain/sdk/viem';
```

## Usage

Initialize a Client with your desired [Network](/docs/chains/introduction) (e.g. `https://mainnet.vechain.org/`).

```js twoslash
import { createPublicClient } from '@vechain/sdk/viem';

const publicClient = createPublicClient({
    network: 'https://mainnet.vechain.org/'
});
```

Then you can consume [Public Actions](/docs/actions/public/introduction):

```js twoslash
// [!include ~/snippets/publicClient.ts]
// ---cut---
const blockNumber = await publicClient.getBlockNumber(); // [!code focus:10]
```

## Parameters

### transport

- **Type:** [Transport](/docs/glossary/types#transport)

The [Transport](/docs/clients/intro) of the Public Client.

```js twoslash
import { createPublicClient, ThorNetworks } from '@vechain/sdk/viem';

const customTransport = new FetchHttpClient(new URL(ThorNetworks.SOLONET), {
    onRequest: (request) => {
        log.debug({
            message: `Making ${request.method} request to ${request.url}`
        });
        return request;
    },
    onResponse: (response) => {
        log.debug({
            message: `Response: ${response.status} ${response.statusText}`
        });
        return response;
    },
    timeout: 10000,
    headers: {
        'User-Agent': 'MyVeChainApp/1.0'
    }
});

const publicClient = createPublicClient({
    network: ThorNetworks.SOLONET,
    transport: customTransport
});
```

### key (optional)

- **Type:** `string`
- **Default:** `"public"`

A key for the Client.

```js twoslash
// [!include ~/snippets/publicClient.ts:imports]
// ---cut---
const publicClient = createPublicClient({
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
// [!include ~/snippets/publicClient.ts:imports]
// ---cut---
const publicClient = createPublicClient({
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
// [!include ~/snippets/publicClient.ts:imports]
// ---cut---
const publicClient = createPublicClient({
    network: ThorNetworks.MAINNET,
    pollingInterval: 10_000, // [!code focus]
    network: ThorNetworks.MAINNET
});
```

### rpcSchema (optional)

- **Type:** `RpcSchema`
- **Default:** `PublicRpcSchema`

Typed JSON-RPC schema for the client.

```js twoslash
// [!include ~/snippets/publicClient.ts:imports]
// @noErrors
// ---cut---
import { rpcSchema } from 'viem'

type CustomRpcSchema = [{ // [!code focus]
  Method: 'eth_wagmi', // [!code focus]
  Parameters: [string] // [!code focus]
  ReturnType: string // [!code focus]
}] // [!code focus]

const publicClient = createPublicClient({
  network: ThorNetworks.MAINNET,
  rpcSchema: rpcSchema<CustomRpcSchema>(), // [!code focus]
  network: ThorNetworks.MAINNET,
})

const result = await publicClient.request({ // [!code focus]
  method: 'eth_wa // [!code focus]
//               ^|
  params: ['hello'], // [!code focus]
}) // [!code focus]
```

## Live Example

Check out the usage of `createPublicClient` in the live [Public Client Example](https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/clients_public-client) below.

<iframe frameBorder="0" width="100%" height="500px" src="https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/clients_public-client?embed=1&file=index.ts&hideNavigation=1&hideDevTools=true&terminalHeight=0&ctl=1"></iframe>
