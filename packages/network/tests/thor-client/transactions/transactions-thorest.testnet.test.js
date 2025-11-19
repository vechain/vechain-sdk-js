"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_thorest_1 = require("./fixture-thorest");
const src_1 = require("../../../src");
/**
 * ThorClient class tests
 *
 * @NOTE: This test suite run on testnet network because it contains read only tests.
 *
 * @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module', () => {
    // ThorClient instance
    let thorClient;
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
    });
    /**
     * getTransaction tests
     */
    (0, globals_1.describe)('getTransaction', () => {
        /**
         * getTransaction - correct cases
         */
        fixture_thorest_1.transactionDetails.correct.forEach((testCase) => {
            (0, globals_1.test)(testCase.testName, async () => {
                // Check block number
                const latestBlock = await thorClient.blocks.getFinalBlockCompressed();
                // Check transaction block. If undefined, it is the 'best' block.
                for (const blockNumber of [latestBlock, undefined]) {
                    const transaction = testCase.transaction.raw
                        ? await thorClient.transactions.getTransactionRaw(testCase.transaction.id, {
                            head: blockNumber?.id,
                            pending: testCase.transaction.pending
                        })
                        : await thorClient.transactions.getTransaction(testCase.transaction.id, {
                            head: blockNumber?.id,
                            pending: testCase.transaction.pending
                        });
                    (0, globals_1.expect)(transaction).toEqual(testCase.expected);
                }
            });
        });
        /**
         * getTransaction - error cases
         */
        fixture_thorest_1.transactionDetails.errors.forEach((testCase) => {
            (0, globals_1.test)(testCase.testName, async () => {
                await (0, globals_1.expect)(thorClient.transactions.getTransaction(testCase.transaction.id, {
                    head: testCase.transaction.head
                })).rejects.toThrow(testCase.expected);
            });
        });
    });
    /**
     * getTransactionReceipt tests
     */
    (0, globals_1.describe)('getTransactionReceipt', () => {
        /**
         * getTransactionReceipt - correct cases
         */
        fixture_thorest_1.transactionReceipts.correct.forEach((testCase) => {
            (0, globals_1.test)(testCase.testName, async () => {
                // Check block number
                const latestBlock = await thorClient.blocks.getFinalBlockCompressed();
                // Check transaction block. If undefined, it is the 'best' block.
                for (const blockNumber of [latestBlock, undefined]) {
                    const transaction = await thorClient.transactions.getTransactionReceipt(testCase.transaction.id, { head: blockNumber?.id });
                    (0, globals_1.expect)(transaction).toEqual(testCase.expected);
                }
            });
        });
        /**
         * getTransactionReceipt - error cases
         */
        fixture_thorest_1.transactionReceipts.errors.forEach((testCase) => {
            (0, globals_1.test)(testCase.testName, async () => {
                await (0, globals_1.expect)(thorClient.transactions.getTransactionReceipt(testCase.transaction.id, { head: testCase.transaction.head })).rejects.toThrow(testCase.expected);
            });
        });
    });
});
