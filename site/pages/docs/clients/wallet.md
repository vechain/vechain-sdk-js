# Wallet Client [A function to create a Wallet Client.]

A Wallet Client is an interface to interact with [Ethereum Account(s)](https://ethereum.org/en/glossary/#account) and provides the ability to retrieve accounts, execute transactions, sign messages, etc through [Wallet Actions](/docs/actions/wallet/introduction).

The `createWalletClient` function sets up a Wallet Client with a given [Transport](/docs/clients/intro).

The Wallet Client supports signing over:

- [JSON-RPC Accounts](#json-rpc-accounts) (e.g. Browser Extension Wallets, WalletConnect, etc.).
- [Local Accounts](#local-accounts-private-key-mnemonic-etc) (e.g. private key/mnemonic wallets).

## Import

```js
import { createWalletClient } from '@vechain/sdk/viem';
```

## JSON-RPC Accounts

A [JSON-RPC Account](/docs/accounts/jsonRpc) **defers** signing of transactions & messages to the target Wallet over JSON-RPC. An example could be sending a transaction via a Browser Extension Wallet (e.g. MetaMask) with the `window.ethereum` Provider.

Below is an example of how you can set up a JSON-RPC Account.

#### 1: Initialize a Wallet Client

Before we set up our Account and start consuming Wallet Actions, we will need to set up our Wallet Client with the [`custom` Transport](/docs/clients/transports/custom), where we will pass in the `window.ethereum` Provider:

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';

const client = createWalletClient({
  network: ThorNetworks.MAINNET
});
```

#### 2: Set up your JSON-RPC Account

We will want to retrieve an address that we can access in our Wallet (e.g. MetaMask).

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';

const client = createWalletClient({
  network: ThorNetworks.MAINNET
});

const [address] = await client.getAddresses(); // [!code focus:10]
// or: const [address] = await client.requestAddresses(); // [!code focus:10]
```

> Note: Some Wallets (like MetaMask) may require you to request access to Account addresses via [`client.requestAddresses`](/docs/actions/wallet/requestAddresses) first.

#### 3: Consume [Wallet Actions](/docs/actions/wallet/introduction)

Now you can use that address within Wallet Actions that require a signature from the user:

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';

const client = createWalletClient({
  network: ThorNetworks.MAINNET
});

const [address] = await client.getAddresses();

const hash = await client.sendTransaction({ // [!code focus:10]
  account: address,
  to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  value: '1000000000000000' // 0.001 VET in wei
});
```

#### Optional: Hoist the Account

If you do not wish to pass an account around to every Action that requires an `account`, you can also hoist the account into the Wallet Client.

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';

const client = createWalletClient({ // [!code focus:99]
  account: '0x...', // [!code ++]
  network: ThorNetworks.MAINNET
});

const hash = await client.sendTransaction({
  account, // [!code --]
  to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  value: '1000000000000000' // 0.001 VET in wei
});
```

## Local Accounts (Private Key, Mnemonic, etc)

A Local Account performs signing of transactions & messages with a private key **before** executing a method over JSON-RPC.

There are three types of Local Accounts in viem:

- [Private Key Account](/docs/accounts/local/privateKeyToAccount)
- [Mnemonic Account](/docs/accounts/local/mnemonicToAccount)
- [Hierarchical Deterministic (HD) Account](/docs/accounts/local/hdKeyToAccount)

Below are the steps to integrate a **Private Key Account**, but the same steps can be applied to **Mnemonic & HD Accounts**.

#### 1: Initialize a Wallet Client

Before we set up our Account and start consuming Wallet Actions, we will need to set up our Wallet Client with the [`http` Transport](/docs/clients/transports/http):

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';

const client = createWalletClient({
  network: ThorNetworks.MAINNET
});
```

#### 2: Set up your Local Account

Next, we will instantiate a Private Key Account using `privateKeyToAccount`:

```js twoslash
import { createWalletClient, privateKeyToAccount, ThorNetworks } from '@vechain/sdk/viem'; // [!code focus]

const client = createWalletClient({
  network: ThorNetworks.MAINNET
});

const account = privateKeyToAccount('0x...'); // [!code focus:1]
```

#### 3: Consume [Wallet Actions](/docs/actions/wallet/introduction)

Now you can use that Account within Wallet Actions that need a signature from the user:

```js twoslash
import { createWalletClient, privateKeyToAccount, ThorNetworks } from '@vechain/sdk/viem';

const client = createWalletClient({
  network: ThorNetworks.MAINNET
});

const account = privateKeyToAccount('0x...');

const hash = await client.sendTransaction({ // [!code focus:5]
  account,
  to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  value: '1000000000000000' // 0.001 VET in wei
});
```

#### Optional: Hoist the Account

If you do not wish to pass an account around to every Action that requires an `account`, you can also hoist the account into the Wallet Client.

```js twoslash
import { createWalletClient, privateKeyToAccount, ThorNetworks } from '@vechain/sdk/viem';

const account = privateKeyToAccount('0x...');

const client = createWalletClient({ // [!code focus:99]
  account, // [!code ++]
  network: ThorNetworks.MAINNET
});

const hash = await client.sendTransaction({
  account, // [!code --]
  to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  value: '1000000000000000' // 0.001 VET in wei
});
```

#### Optional: Extend with Public Actions

When using a Local Account, you may be finding yourself using a [Public Client](/docs/clients/public) instantiated with the same parameters (`transport`, `chain`, etc) as your Wallet Client.

In this case, you can extend your Wallet Client with [Public Actions](/docs/actions/public/introduction) to avoid having to handle multiple Clients.

```js twoslash
// @noErrors
import { createWalletClient, privateKeyToAccount, ThorNetworks } from '@vechain/sdk/viem';

const account = privateKeyToAccount('0x...');

const client = createWalletClient({ // [!code focus]
  account,
  network: ThorNetworks.MAINNET
}); // [!code ++] // [!code focus]

// VeChain SDK provides integrated public actions
const blockNumber = await client.getBlockNumber(); // Public Action // [!code focus]
const hash = await client.sendTransaction({ /* ... */ }); // Wallet Action // [!code focus]
```

## Parameters

### account (optional)

- **Type:** `Account | Address`

The Account to use for the Wallet Client. This will be used for Actions that require an `account` as an argument.

Accepts a [JSON-RPC Account](#json-rpc-accounts) or [Local Account (Private Key, etc)](#local-accounts-private-key-mnemonic-etc).

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';

const client = createWalletClient({
  account: '0x...', // [!code focus]
  network: ThorNetworks.MAINNET
});

const hash = await client.sendTransaction({
  to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  value: '1000000000000000' // 0.001 VET in wei
});
```

### network (optional)

- **Type:** [Chain](/docs/glossary/types#chain)

The [Chain](/docs/chains/introduction) of the Wallet Client.

Used in the [`sendTransaction`](/docs/actions/wallet/sendTransaction) & [`writeContract`](/docs/contract/writeContract) Actions to assert that the chain matches the wallet's active chain.

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// ---cut---
const client = createWalletClient({
  network: ThorNetworks.MAINNET // [!code focus]
});
```

### cacheTime (optional)

- **Type:** `number`
- **Default:** `client.pollingInterval`

Time (in ms) that cached data will remain in memory.

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// ---cut---
const client = createWalletClient({
  cacheTime: 10_000, // [!code focus]
  network: ThorNetworks.MAINNET
});
```

### ccipRead (optional)

- **Type:** `(parameters: CcipRequestParameters) => Promise<CcipRequestReturnType> | false`
- **Default:** `true`

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

CCIP Read is enabled by default, but if set to `false`, the client will not support offchain CCIP lookups.

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// ---cut---
const client = createWalletClient({
  ccipRead: false, // [!code focus]
  network: ThorNetworks.MAINNET
});
```

### ccipRead.request (optional)

- **Type:** `(parameters: CcipRequestParameters) => Promise<CcipRequestReturnType>`

A function that will be called to make the [offchain CCIP lookup request](https://eips.ethereum.org/EIPS/eip-3668#client-lookup-protocol).

```js twoslash
// @noErrors
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// ---cut---
const client = createWalletClient({
  ccipRead: { // [!code focus]
    async request({ data, sender, urls }) { // [!code focus]
      // ... // [!code focus]
    } // [!code focus]
  }, // [!code focus]
  network: ThorNetworks.MAINNET
});
```

### key (optional)

- **Type:** `string`
- **Default:** `"wallet"`

A key for the Client.

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// ---cut---
const client = createWalletClient({
  key: 'foo', // [!code focus]
  network: ThorNetworks.MAINNET
});
```

### name (optional)

- **Type:** `string`
- **Default:** `"Wallet Client"`

A name for the Client.

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// ---cut---
const client = createWalletClient({
  name: 'Foo Wallet Client', // [!code focus]
  network: ThorNetworks.MAINNET
});
```

### pollingInterval (optional)

- **Type:** `number`
- **Default:** `4_000`

Frequency (in ms) for polling enabled Actions.

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// ---cut---
const client = createWalletClient({
  pollingInterval: 10_000, // [!code focus]
  network: ThorNetworks.MAINNET
});
```

### rpcSchema (optional)

- **Type:** `RpcSchema`
- **Default:** `WalletRpcSchema`

Typed JSON-RPC schema for the client.

```js twoslash
import { createWalletClient, ThorNetworks } from '@vechain/sdk/viem';
// @noErrors
// ---cut---

type CustomRpcSchema = [{ // [!code focus]
  Method: 'thor_wagmi', // [!code focus]
  Parameters: [string] // [!code focus]
  ReturnType: string // [!code focus]
}]; // [!code focus]

const client = createWalletClient({
  rpcSchema: CustomRpcSchema, // [!code focus]
  network: ThorNetworks.MAINNET
});

const result = await client.request({ // [!code focus]
  method: 'thor_wa // [!code focus] 
//               ^|
  params: ['hello'], // [!code focus]
}); // [!code focus]
```