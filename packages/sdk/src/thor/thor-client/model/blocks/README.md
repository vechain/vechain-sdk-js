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
- Wraps a `RegularBlockResponse`.
- Provides convenient getters for `number`, `id`, `baseFeePerGas`,
  `transactions`, `isTrunk`, and `isFinalized` while still exposing the raw
  response under the `data` property for advanced use cases.

### `ExpandedBlock`
- Wraps an `ExpandedBlockResponse` and exposes all expanded transactions.
- Mirrors the getter API of `Block` (including `number`, `id`, `baseFeePerGas`,
  `isTrunk`, and `isFinalized`).

### `RawBlock`
- Wraps a `RawBlockResponse` and exposes the RLP-encoded block via the `raw`
  getter.

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

