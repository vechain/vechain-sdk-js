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
