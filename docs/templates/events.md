# Events

The VeChain SDK allows querying the blockchain for events emitted by smart contracts.

## Filtering a single Transfer Event

With the VeChain SDK the contract object could be used also for filtering events emitted from the contract. It is also possible to specify the some filtering options (range, result limit, etc)

Following an example on how to listen to a Transfer Event:

[ERC20FilterEventSnippet](examples/contracts/contract-event-filter.ts)


## Multi-Clause Event Filtering

Filter events from different contracts in a single call using contract addresses and event signatures.

[ERC20FilterMultipleEventCriteriaSnippet](examples/contracts/contract-event-filter.ts)

### Grouping Events by Topic Hash

Use `filterGroupedEventLogs` to group events by topic hash, useful for categorizing events. The result is an array of arrays, one for each criterion.

[ERC20FilterGroupedMultipleEventCriteriaSnippet](examples/contracts/contract-event-filter.ts)

