---
description: Transforms arbitrary data into blobs.
---

# toBlobs

Transforms arbitrary data into Viem-shaped blobs.

:::warning
This function transforms data into Viem-shaped blobs. It is designed to be used with Viem's `fromBlobs` function to convert back to the data.
:::

## Import

```js twoslash
import { toBlobs } from 'viem';
```

## Usage

```js twoslash [example.ts]
import { toBlobs } from 'viem';

const blobs = toBlobs({ data: '0x...' });
```

## Returns

`Hex[] | ByteArray[]`

Blobs from the input data.

## Parameters

### data

- **Type:** `Hex | ByteArray`

Data to transform into blobs.

```js twoslash
import { toBlobs } from 'viem';

const blobs = toBlobs({
    data: '0x...' // [!code focus]
});
```

### to

- **Type:** `"bytes" | "hex"`

The output type.

```js twoslash
import { toBlobs } from 'viem';

const blobs = toBlobs({
    data: '0x...',
    to: 'bytes' // [!code focus]
});

blobs; // [!code focus]
// ^?
```
