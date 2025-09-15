---
description: Transforms blobs into the originating data.
---

# fromBlobs

Transforms Viem-shaped blobs into the originating data.

:::warning
This function transforms data from Viem-shaped blobs. It is designed to be used with Viem's `toBlobs` function to convert arbitrary data to blobs.
:::

## Import

```js twoslash
import { fromBlobs } from 'viem';
```

## Usage

```js twoslash [example.ts]
import { fromBlobs } from 'viem';

const data = fromBlobs({ blobs: ['0x...'] });
```

## Returns

`Hex | ByteArray`

Data extracted from blobs.

## Parameters

### blobs

- **Type:** `Hex[] | ByteArray[]`

Transforms blobs into the originating data.

```js twoslash
import { fromBlobs } from 'viem';

const data = fromBlobs({
    blobs: ['0x...'] // [!code focus]
});
```

### to

- **Type:** `"bytes" | "hex"`

The output type.

```js twoslash
import { fromBlobs } from 'viem';

const data = fromBlobs({
    blobs: ['0x...'],
    to: 'bytes' // [!code focus]
});

data; // [!code focus]
// ^?
```
