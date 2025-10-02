# Blocks Domain Models

This package contains the SDK-facing domain objects that sit on top of the
`@thor/thorest` request/response layer for block data.

## Transformation Pipeline

| JSON type | Typed response | Domain model |
| --- | --- | --- |
| `ExpandedBlockResponseJSON` | `ExpandedBlockResponse` | `ExpandedBlock` |
| `RegularBlockResponseJSON` | `RegularBlockResponse` | `Block` |
| `RawBlockJSON` | `RawBlockResponse` | `RawBlock` |

Each domain model exposes a static `fromResponse` factory that accepts the
typed response (or `null`) and returns the corresponding domain object. This
keeps the mapping logic centralised and consistent across the SDK.

## Classes Overview

### `Block`
- Mirrors a `RegularBlockResponse`, copying all fields directly into the
  domain object.
- Exposes friendly properties (`number`, `id`, `gasLimit`, `transactions`,
  ecc.) ready for SDK consumers.

### `ExpandedBlock`
- Mirrors an `ExpandedBlockResponse`, including the list of
  `TxWithReceipt` elementi.
- Condivide la stessa superficie (`number`, `gasLimit`, `isFinalized`, ecc.) di
  `Block` per coerenza.

### `RawBlock`
- Copia il contenuto di `RawBlockResponse` esponendo la proprietà `raw` già
  convertita in stringa.

## Usage Example

```ts
import { Block } from '@thor/thor-client/model';
import { RetrieveRegularBlock } from '@thor/thorest';

const response = await RetrieveRegularBlock.of('best').askTo(httpClient);
const block = Block.fromResponse(response.response);

if (block !== null) {
    console.log(block.id, block.number, block.transactions.length);
}
```

## Testing

Unit tests live under `packages/sdk/tests/thor/thor-client/blocks` and cover
the `fromResponse` factories and primary getters for all domain models.

