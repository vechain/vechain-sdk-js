# Polling Mechanisms

## Synchronous Polling

Synchronous polling mechanisms are implemented to await the fulfillment of specific conditions. Upon the satisfaction of these conditions, the polling process yields the result of the given condition.

### Monitoring for a New Block Production
This section illustrates the methodology for monitoring the production of a new block. Utilizing synchronous polling, the waitUntil function is employed to efficiently wait for the production of a new block.

```typescript { name=sync-poll-wait-new-block, category=example }
import {
    HttpClient,
    Poll,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create client for testnet
const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorestClient = new ThorestClient(testNetwork);

// 2 - Get current block
const currentBlock = await thorestClient.blocks.getBestBlock();

console.log('Current block:', currentBlock);

// 3 - Wait until a new block is created
const newBlock = await Poll.SyncPoll(
    // Get the latest block as polling target function
    async () => await thorestClient.blocks.getBlock('best'),
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
Here, we explore the approach to monitor balance changes subsequent to a transfer. Synchronous polling leverages the waitUntil function to detect balance changes following a transfer.

```typescript { name=sync-poll-wait-balance-update, category=example }
import {
    HttpClient,
    Poll,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import {
    dataUtils,
    Transaction,
    TransactionHandler,
    TransactionUtils
} from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Create client for solo network

const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorestSoloClient = new ThorestClient(soloNetwork);

// 2- Init transaction

// 2.1 - Get latest block
const latestBlock = await thorestSoloClient.blocks.getFinalBlock();

// 2.2 - Transaction sender and receiver
const sender = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: Buffer.from(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        'hex'
    )
};

const receiver = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: Buffer.from(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e',
        'hex'
    )
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
// @NOTE: To improve the performance, we use a fixed gas price here.
const gas = 5000 + TransactionUtils.intrinsicGas(clauses) * 5;

// 2.4 - Create transactions
const transaction = new Transaction({
    // Solo network chain tag
    chainTag: 0xf6,
    // Solo network block ref
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas,
    dependsOn: null,
    nonce: 12345678
});

// 2.5 - Sign and get raw transaction
const encoded = TransactionHandler.sign(transaction, sender.privateKey).encoded;
const raw = `0x${encoded.toString('hex')}`;

// 3 - Get the sender and receiver balance before the transaction

const senderBalanceBefore = (
    await thorestSoloClient.accounts.getAccount(sender.address)
).balance;

const receiverBalanceBefore = (
    await thorestSoloClient.accounts.getAccount(receiver.address)
).balance;

console.log('Sender balance before:', senderBalanceBefore);
console.log('Receiver balance before:', receiverBalanceBefore);

// 4 - Send transaction

const sentedTransaction =
    await thorestSoloClient.transactions.sendTransaction(raw);

// 4.1 - Check if the transaction is sent successfully (check if the transaction id is a valid hex string)
expect(sentedTransaction).toBeDefined();
expect(sentedTransaction).toHaveProperty('id');
expect(dataUtils.isHexString(sentedTransaction.id)).toBe(true);

console.log('Transaction sent:', sentedTransaction);

// 4 -Wait until balance is updated

const newBalanceSender = await Poll.SyncPoll(
    async () =>
        (await thorestSoloClient.accounts.getAccount(sender.address)).balance
).waitUntil((newBalance) => {
    return newBalance !== senderBalanceBefore;
});

const newBalanceReceiver = await Poll.SyncPoll(
    async () =>
        (await thorestSoloClient.accounts.getAccount(receiver.address)).balance
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
import {
    HttpClient,
    Poll,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import {
    Transaction,
    TransactionHandler,
    TransactionUtils
} from '@vechainfoundation/vechain-sdk-core';

const createAndSendTransaction = async (
    senderPrivateKey: Buffer,
    receiverAddress: string,
    client: ThorestClient
): Promise<string> => {
    // 1 - Get latest block
    const latestBlock = await client.blocks.getFinalBlock();

    // 2 - Create transaction clauses
    const clauses = [
        {
            to: receiverAddress,
            value: 1000000,
            data: '0x'
        }
    ];

    // 3 - Calculate gas
    // @NOTE: To improve the performance, we use a fixed gas price here.
    const gas = 5000 + TransactionUtils.intrinsicGas(clauses) * 5;

    // 4 - Create transactions
    const transaction = new Transaction({
        // Solo network chain tag
        chainTag: 0xf6,
        // Solo network block ref
        blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
        expiration: 32,
        clauses,
        gasPriceCoef: 128,
        gas,
        dependsOn: null,
        nonce: 12345678
    });

    // 5 - Sign and get raw transaction
    const encoded = TransactionHandler.sign(
        transaction,
        senderPrivateKey
    ).encoded;
    const raw = `0x${encoded.toString('hex')}`;

    // 6 - Send transaction
    const sentedTransaction = await client.transactions.sendTransaction(raw);

    return sentedTransaction.id;
};

// 1 - Create client for solo network

const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorestSoloClient = new ThorestClient(soloNetwork);

// 2- Create sender and receiver

const sender = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: Buffer.from(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        'hex'
    )
};

const receiver = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: Buffer.from(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e',
        'hex'
    )
};

// 3 - Send transaction every 1 second (SENDER)
const sendTransactionPoll = Poll.createEventPoll(
    async () =>
        await createAndSendTransaction(
            sender.privateKey,
            receiver.address,
            thorestSoloClient
        ),
    1000
)
    .onStart((eventPoll) => {
        console.log('Start sending transaction every 3 seconds');
        console.log('Event poll (sender):', eventPoll);
    })
    .onStop((eventPoll) => {
        console.log('Stop sending transaction every 3 seconds');
        console.log('Event poll (sender):', eventPoll);
    })
    .onData((transactionId: string, eventPoll) => {
        console.log('Sented transaction:', transactionId);

        // Stop after 3 iterations - EXIT CONDITION
        if (eventPoll.getCurrentIteration === 3) eventPoll.stopListen();
    })
    .onError((error, eventPoll) => {
        console.log('Error:', error);
        console.log('Event poll (sender):', eventPoll);
    });

sendTransactionPoll.startListen();

// 4 - Verify the balance of the receiver account every 1 second (RECEIVER)
const verifyBalancePoll = Poll.createEventPoll(
    async () => await thorestSoloClient.accounts.getAccount(receiver.address),
    1000
)
    .onStart((eventPoll) => {
        console.log('Start verifying balance every 3 seconds');
        console.log('Event poll (receiver):', eventPoll);
    })
    .onStop((eventPoll) => {
        console.log('Stop verifying balance every 3 seconds');
        console.log('Event poll (receiver):', eventPoll);
    })
    .onData((account, eventPoll) => {
        console.log('Receiver account:', account);

        // Stop after 3 iterations - EXIT CONDITION
        if (eventPoll.getCurrentIteration === 3) eventPoll.stopListen();
    })
    .onError((error, eventPoll) => {
        console.log('Error:', error);
        console.log('Event poll (receiver):', eventPoll);
    });

verifyBalancePoll.startListen();

```




