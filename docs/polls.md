# Polling Mechanisms

## Synchronous Polling

Synchronous polling mechanisms are implemented to await the fulfillment of specific conditions. Upon the satisfaction of these conditions, the polling process yields the result of the given condition.

### Monitoring for a New Block Production
This section illustrates the methodology for monitoring the production of a new block. Utilizing synchronous polling, the waitUntil function is employed to efficiently wait for the production of a new block.

```typescript { name=sync-poll-wait-new-block, category=example }
import { Poll, TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for testnet

const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Get current block

const currentBlock = await thorClient.blocks.getBestBlockCompressed();

console.log('Current block:', currentBlock);

// 3 - Wait until a new block is created

// Wait until a new block is created with polling interval of 3 seconds
const newBlock = await Poll.SyncPoll(
    // Get the latest block as polling target function
    async () => await thorClient.blocks.getBlockCompressed('best'),
    // Polling interval is 3 seconds
    { requestIntervalInMilliseconds: 3000 }
).waitUntil((newBlockData) => {
    // Stop polling when the new block number is greater than the current block number
    return (newBlockData?.number as number) > (currentBlock?.number as number);
});

expect(newBlock).toBeDefined();
expect(newBlock?.number).toBeGreaterThan(currentBlock?.number as number);

console.log('New block:', newBlock);

```

### Observing Balance Changes Post-Transfer
Here, we explore the approach to monitor balance changes after a transfer. Synchronous polling leverages the waitUntil function to detect balance changes following a transfer.

```typescript { name=sync-poll-wait-balance-update, category=example }
import { Poll, THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
import { Hex, TransactionHandler } from '@vechain/sdk-core';
import { expect } from 'expect';

// 1 - Create thor client for solo network

const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

// 2- Init transaction

// 2.1 - Get latest block
const latestBlock = await thorSoloClient.blocks.getBestBlockCompressed();

// 2.2 - Transaction sender and receiver
const sender = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: HexUInt.of(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
    ).bytes
};

const receiver = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: HexUInt.of(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e'
    ).bytes
};

// 2.2 - Create transaction clauses
const clauses = [
    {
        to: receiver.address,
        value: 1000000,
        data: '0x'
    }
];

// 2.3 - Calculate gas
const gasResult = await thorSoloClient.gas.estimateGas(clauses, sender.address);

// 2.4 - Create transactions
const transactionBody = {
    // Solo network chain tag
    chainTag: 0xf6,
    // Solo network block ref
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
};

// 2.5 - Sign and get raw transaction
const encoded = TransactionHandler.sign(
    transactionBody,
    sender.privateKey
).encoded;
const raw = `0x${encoded.toString('hex')}`;

// 3 - Get the sender and receiver balance before the transaction

const senderBalanceBefore = (
    await thorSoloClient.accounts.getAccount(sender.address)
).balance;

const receiverBalanceBefore = (
    await thorSoloClient.accounts.getAccount(receiver.address)
).balance;

console.log('Sender balance before:', senderBalanceBefore);
console.log('Receiver balance before:', receiverBalanceBefore);

// 4 - Send transaction

const sentTransaction =
    await thorSoloClient.transactions.sendRawTransaction(raw);

// 4.1 - Check if the transaction is sent successfully (check if the transaction id is a valid hex string)
expect(sentTransaction).toBeDefined();
expect(sentTransaction).toHaveProperty('id');
expect(HexUInt.isValid0x(sentTransaction.id)).toBe(true);

// 4 -Wait until balance is updated

// New balance of sender (wait until the balance is updated)
const newBalanceSender = await Poll.SyncPoll(
    async () =>
        (await thorSoloClient.accounts.getAccount(sender.address)).balance
).waitUntil((newBalance) => {
    return newBalance !== senderBalanceBefore;
});

// New balance of receiver (wait until the balance is updated)
const newBalanceReceiver = await Poll.SyncPoll(
    async () =>
        (await thorSoloClient.accounts.getAccount(receiver.address)).balance
).waitUntil((newBalance) => {
    return newBalance !== receiverBalanceBefore;
});

expect(newBalanceSender).toBeDefined();
expect(newBalanceReceiver).toBeDefined();

expect(newBalanceSender).not.toBe(senderBalanceBefore);
expect(newBalanceReceiver).not.toBe(receiverBalanceBefore);

console.log('New balance of sender:', newBalanceSender);
console.log('New balance of receiver:', newBalanceReceiver);

```

## Asynchronous Polling

Asynchronous polling is utilized for waiting in a non-blocking manner until a specific condition is met or to capture certain events. This type of polling makes use of the Event Emitter pattern, providing notifications when the specified condition or event has been met or emitted.

### Implementing a Simple Async Poll in a DAPP
This example demonstrates the application of an asynchronous poll for tracking transaction events, allowing for the execution of additional operations concurrently.

```typescript { name=event-poll-dapp, category=example }
import { Poll, TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for testnet

const thorClient = ThorClient.fromUrl(TESTNET_URL);

// 2 - Init accounts

const accounts = [
    '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39'
];

// 3 - Monitor status for each account

for (const account of accounts) {
    const monitoringPoll = Poll.createEventPoll(
        async () => await thorClient.accounts.getAccount(account),
        1000
    )
        // Add listeners for start event
        .onStart((eventPoll) => {
            console.log(`Start monitoring account ${account}`, eventPoll);
        })

        // Add listeners for stop event
        .onStop((eventPoll) => {
            console.log(`Stop monitoring account ${account}`, eventPoll);
        })

        // Add listeners for data event. It intercepts the account details every 1 second
        .onData((accountDetails, eventPoll) => {
            console.log(`Account details of ${account}:`, accountDetails);

            // Stop after 3 iterations - EXIT CONDITION
            if (eventPoll.getCurrentIteration === 3) eventPoll.stopListen();
        })

        // Add listeners for error event
        .onError((error) => {
            console.log('Error:', error);
        });

    monitoringPoll.startListen();

    // It seems to be strange, BUT onData is called only after 1 second of the eventPoll.startListen() call.
    expect(monitoringPoll.getCurrentIteration).toBe(0);
}

```




