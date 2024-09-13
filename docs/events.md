# Events

The VeChain SDK allows querying the blockchain for events emitted by smart contracts.

## Filtering a single Transfer Event

With the VeChain SDK the contract object could be used also for filtering events emitted from the contract. It is also possible to specify the some filtering options (range, result limit, etc)

Following an example on how to listen to a Transfer Event:

```typescript { name=contract-event-filter, category=example }
// Starting from a deployed contract instance, transfer some tokens to a specific address
const transferResult = await contractErc20.transact.transfer(
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    10000n
);

// Wait for the transfer transaction to complete and obtain its receipt
const transactionReceiptTransfer =
    (await transferResult.wait()) as TransactionReceipt;

// Asserting that the transaction has not been reverted
expect(transactionReceiptTransfer.reverted).toEqual(false);

// 1. passing an array of arguments
const transferEventsArrayArgs = await contractErc20.filters
    .Transfer([undefined, '0x9e7911de289c3c856ce7f421034f66b6cde49c39'])
    .get();

// 2. passing an object with the arguments as properties
const transferEventsObjectArgs = await contractErc20.filters
    .Transfer({
        to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39'
    })
    .get();

// Asserting that the transfer event has been emitted
expect(transferEventsArrayArgs.length).toEqual(1);
expect(transferEventsObjectArgs.length).toEqual(1);

// log the transfer events
console.log(transferEventsArrayArgs);
```


## Multi-Clause Event Filtering

Filter events from different contracts in a single call using contract addresses and event signatures.

```typescript { name=contract-event-filter, category=example }
const contractEventExample = await setupEventExampleContract();

await (await contractEventExample.transact.setValue(3000n)).wait();

const transferCriteria = contractErc20.criteria.Transfer({
    to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39'
});

const valueCriteria = contractEventExample.criteria.ValueSet();

const events = await thorSoloClient.logs.filterEventLogs({
    criteriaSet: [transferCriteria, valueCriteria]
});

console.log(events);

// Asserting that I'm filtering a previous transfer event and the new value set event
expect(events.map((x) => x.decodedData)).toEqual([
    [
        '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
        '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
        10000n
    ],
    ['0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54', 3000n]
]);
```

### Grouping Events by Topic Hash

Use `filterGroupedEventLogs` to group events by topic hash, useful for categorizing events. The result is an array of arrays, one for each criterion.

```typescript { name=contract-event-filter, category=example }
const groupedEvents = await thorSoloClient.logs.filterGroupedEventLogs({
    criteriaSet: [transferCriteria, valueCriteria]
});

// Asserting that I'm filtering a previous transfer event and the new value set event
expect(groupedEvents[0].map((x) => x.decodedData)).toEqual([
    [
        '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
        '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
        10000n
    ]
]);

expect(groupedEvents[1].map((x) => x.decodedData)).toEqual([
    ['0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54', 3000n]
]);
```


