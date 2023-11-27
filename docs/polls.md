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

// Create client for testnet
const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorestClient = new ThorestClient(testNetwork);

// Current block
const currentBlock = await thorestClient.blocks.getBestBlock();
console.log(currentBlock);

// Wait until a new block is created
const newBlock = await Poll.SyncPoll(
    async () => await thorestClient.blocks.getBlock('best'),
    { requestIntervalInMilliseconds: 3000 }
).waitUntil((newBlockData) => {
    return (newBlockData?.number as number) > (currentBlock?.number as number);
});

expect(newBlock).toBeDefined();
expect(newBlock?.number).toBeGreaterThan(currentBlock?.number as number);
console.log(newBlock);

```

### Observing Balance Changes Post-Transfer
Here, we explore the approach to monitor balance changes subsequent to a transfer. Synchronous polling leverages the waitUntil function to detect balance changes following a transfer.

```typescript { name=sync-poll-wait-balance-update, category=example }
// WAIT FOR SOLO NODE IMPLEMENTATION
// import { describe, expect, test } from '@jest/globals';
// import { TEST_ACCOUNTS, thorestSoloClient } from '../../../fixture';
// import { Poll } from '../../../../src/utils/poll';
// import {
//     dataUtils,
//     Transaction,
//     TransactionHandler,
//     TransactionUtils
// } from '@vechainfoundation/vechain-sdk-core';
// import { sendTransactionErrors } from '../../../clients/thorest-client/transactions/fixture';
//
// /**
//  * Test the Synchronous poll on Solo node with real world example
//  * @group integration/utils/sync-poll-example-solo
//  */
// describe('Synchronous poll tests - Solo', () => {
//     /**
//      * Test the updated balance event
//      */
//     test('Wait until a balance is updated after a transaction', async () => {
//         // 1- Init transaction
//
//         // Get latest block
//         const latestBlock = await thorestSoloClient.blocks.getBestBlock();
//
//         // Get gas @NOTE it is approximation. This part must be improved.
//         const gas =
//             5000 +
//             TransactionUtils.intrinsicGas(
//                 sendTransactionErrors.correct[0].transaction.clauses
//             ) *
//             5;
//
//         // Create transactions
//         const transaction = new Transaction({
//             chainTag: 0xf6,
//             blockRef:
//                 latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
//             expiration: 32,
//             clauses: sendTransactionErrors.correct[0].transaction.clauses,
//             gasPriceCoef: 128,
//             gas,
//             dependsOn: null,
//             nonce: 12345678
//         });
//
//         // Normal signature and delegation signature
//         const rawNormalSigned = TransactionHandler.sign(
//             transaction,
//             Buffer.from(
//                 TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
//                 'hex'
//             )
//         ).encoded;
//
//         // 2 - Get the sender and receiver balance before the transaction
//         const senderBalanceBefore = (
//             await thorestSoloClient.accounts.getAccount(
//                 TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
//             )
//         ).balance;
//         const receiverBalanceBefore = (
//             await thorestSoloClient.accounts.getAccount(
//                 TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
//             )
//         ).balance;
//
//         // 3 - Send transaction
//
//         const send = await thorestSoloClient.transactions.sendTransaction(
//             `0x${rawNormalSigned.toString('hex')}`
//         );
//         expect(send).toBeDefined();
//         expect(send).toHaveProperty('id');
//         expect(dataUtils.isHexString(send.id)).toBe(true);
//
//         // 4 -Wait until balance is updated
//         const newBalanceSender = await Poll.SyncPoll(
//             async () =>
//                 (
//                     await thorestSoloClient.accounts.getAccount(
//                         TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
//                     )
//                 ).balance
//         ).waitUntil((newBalance) => {
//             return newBalance !== senderBalanceBefore;
//         });
//
//         const newBalanceReceiver = await Poll.SyncPoll(
//             async () =>
//                 (
//                     await thorestSoloClient.accounts.getAccount(
//                         TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
//                     )
//                 ).balance
//         ).waitUntil((newBalance) => {
//             return newBalance !== receiverBalanceBefore;
//         });
//
//         expect(newBalanceSender).toBeDefined();
//         expect(newBalanceReceiver).toBeDefined();
//         expect(newBalanceSender).not.toBe(senderBalanceBefore);
//         expect(newBalanceReceiver).not.toBe(receiverBalanceBefore);
//     }, 30000);
// });

```

## Asynchronous Polling

Asynchronous polling is utilized for waiting in a non-blocking manner until a specific condition is met or to capture certain events. This type of polling makes use of the Event Emitter pattern, providing notifications when the specified condition or event has been met or emitted.

### Implementing a Simple Async Poll in a DAPP
This example demonstrates the application of an asynchronous poll for tracking transaction events, allowing for the execution of additional operations concurrently.

```typescript { name=event-poll-dapp, category=example }
// WAIT FOR SOLO NODE IMPLEMENTATION

```




