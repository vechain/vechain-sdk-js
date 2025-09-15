---
description: Creates EIP-4361 formatted message.
---

# createSiweMessage

Creates [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message.

## Import

```js twoslash
import { createSiweMessage } from 'viem/siwe';
```

## Usage

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1'
});
```

## Returns

`string`

EIP-4361 formatted message.

## Parameters

### address

- **Type:** `Address`

The Ethereum address performing the signing.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', // [!code focus]
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1'
});
```

### chainId

- **Type:** `number`

The [EIP-155](https://eips.ethereum.org/EIPS/eip-155) Chain ID to which the session is bound.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
    chainId: 1, // [!code focus]
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1'
});
```

### domain

- **Type:** `string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) authority that is requesting the signing.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com', // [!code focus]
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1'
});
```

### nonce

- **Type:** `string`

A random string typically chosen by the relying party and used to prevent replay attacks.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz', // [!code focus]
    uri: 'https://example.com/path',
    version: '1'
});
```

### uri

- **Type:** `string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) URI referring to the resource that is the subject of the signing (as in the subject of a claim).

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path', // [!code focus]
    version: '1'
});
```

### version

- **Type:** `'1'`

The current version of the SIWE Message.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1' // [!code focus]
});
```

### expirationTime (optional)

- **Type:** `Date`

Time when the signed authentication message is no longer valid.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1',
    expirationTime: new Date() // [!code focus]
});
```

### issuedAt (optional)

- **Type:** `Date`

Time when the message was generated, typically the current time.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1',
    issuedAt: new Date() // [!code focus]
});
```

### notBefore (optional)

- **Type:** `Date`

Time when the signed authentication message will become valid.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1',
    notBefore: new Date() // [!code focus]
});
```

### requestId (optional)

- **Type:** `string`

A system-specific identifier that may be used to uniquely refer to the sign-in request.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1',
    requestId: '123e4567-e89b-12d3-a456-426614174000' // [!code focus]
});
```

### resources (optional)

- **Type:** `string[]`

A list of information or references to information the user wishes to have resolved as part of authentication by the relying party.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1',
    resources: [
        // [!code focus]
        'https://example.com/foo', // [!code focus]
        'https://example.com/bar', // [!code focus]
        'https://example.com/baz' // [!code focus]
    ] // [!code focus]
});
```

### scheme (optional)

- **Type:** `string`

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) URI scheme of the origin of the request.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1',
    scheme: 'https' // [!code focus]
});
```

### statement (optional)

- **Type:** `string`

A human-readable ASCII assertion that the user will sign.

```js twoslash
import { createSiweMessage } from 'viem/siwe';

const message = createSiweMessage({
    address: '0xa0cf798816d4b9b9866b5330eea46a18382f251e',
    chainId: 1,
    domain: 'example.com',
    nonce: 'foobarbaz',
    uri: 'https://example.com/path',
    version: '1',
    statement:
        'I accept the ExampleOrg Terms of Service: https://example.com/tos' // [!code focus]
});
```
