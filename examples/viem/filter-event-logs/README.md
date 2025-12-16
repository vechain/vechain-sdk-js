# Filter Event Logs (viem)

This example demonstrates filtering and decoding event logs using viem-compatible APIs.

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/thor/filter-event-logs)


## Usage

```bash
yarn dev
```

or

```bash
tsx index.ts
```

## viem Features Used

This example uses the following viem-compatible APIs:

### From `viem`

| Function | Description |
|----------|-------------|
| `parseAbiItem` | Parses an event signature string into a typed ABI item |
| `encodeEventTopics` | Encodes indexed event parameters into filter topics |

### From `@vechain/sdk-temp/viem`

| Function | Description |
|----------|-------------|
| `createPublicClient` | Creates a viem-compatible public client for reading blockchain data |

### PublicClient Methods

- `getBlockNumber()` - Gets the current block number
- `createEventFilter(params)` - Creates a filter for querying event logs with address, event ABI, args, and block range
- `getLogs(filter)` - Retrieves and decodes event logs matching the filter

## What it demonstrates

- How to create a viem-compatible `PublicClient`
- How to use `parseAbiItem` from viem to define event ABIs
- How to use `encodeEventTopics` from viem to encode indexed filter arguments
- How to get the current block number via `publicClient.getBlockNumber()`
- How to create event filters via `publicClient.createEventFilter()`
- How to retrieve decoded event logs via `publicClient.getLogs()`
- Filtering Transfer events by the `to` address on the VTHO contract
