import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { testNetwork } from '../../fixture';
import { transactionDetails, transactionReceipts } from './fixture-thorest';
import { ThorClient } from '../../../src';

/**
 * ThorClient class tests
 *
 * @NOTE: This test suite run on testnet network because it contains read only tests.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(testNetwork);
    });

    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * getTransaction tests
     */
    describe('getTransaction', () => {
        /**
         * getTransaction - correct cases
         */
        transactionDetails.correct.forEach((testCase) => {
            test(testCase.testName, async () => {
                // Check block number
                const latestBlock = await thorClient.blocks.getFinalBlock();

                // Check transaction block. If undefined, it is the 'best' block.
                for (const blockNumber of [latestBlock, undefined]) {
                    const transaction =
                        await thorClient.transactions.getTransaction(
                            testCase.transaction.id,
                            {
                                raw: testCase.transaction.raw,
                                head: blockNumber?.id,
                                pending: testCase.transaction.pending
                            }
                        );
                    expect(transaction).toEqual(testCase.expected);
                }
            });
        });

        /**
         * getTransaction - error cases
         */
        transactionDetails.errors.forEach((testCase) => {
            test(testCase.testName, async () => {
                await expect(
                    thorClient.transactions.getTransaction(
                        testCase.transaction.id,
                        {
                            raw: testCase.transaction.raw,
                            head: testCase.transaction.head
                        }
                    )
                ).rejects.toThrow(testCase.expected);
            });
        });
    });

    /**
     * getTransactionReceipt tests
     */
    describe('getTransactionReceipt', () => {
        /**
         * getTransactionReceipt - correct cases
         */
        transactionReceipts.correct.forEach((testCase) => {
            test(testCase.testName, async () => {
                // Check block number
                const latestBlock = await thorClient.blocks.getFinalBlock();

                // Check transaction block. If undefined, it is the 'best' block.
                for (const blockNumber of [latestBlock, undefined]) {
                    const transaction =
                        await thorClient.transactions.getTransactionReceipt(
                            testCase.transaction.id,
                            { head: blockNumber?.id }
                        );
                    expect(transaction).toEqual(testCase.expected);
                }
            });
        });

        /**
         * getTransactionReceipt - error cases
         */
        transactionReceipts.errors.forEach((testCase) => {
            test(testCase.testName, async () => {
                await expect(
                    thorClient.transactions.getTransactionReceipt(
                        testCase.transaction.id,
                        { head: testCase.transaction.head }
                    )
                ).rejects.toThrow(testCase.expected);
            });
        });
    });
});
