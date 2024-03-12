import { beforeEach, afterEach, describe, expect, test } from '@jest/globals';
import {
    invalidBlockRevisions,
    validCompressedBlockRevisions,
    validExpandedBlockRevisions,
    waitForBlockTestCases
} from './fixture';
import { HttpClient, Poll, ThorClient } from '../../../src';
import { testnetUrl } from '../../fixture';
import { networkInfo } from '@vechain/sdk-core';

/**
 * Blocks Module integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
describe('ThorClient - Blocks Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(new HttpClient(testnetUrl), {
            isPollingEnabled: true
        });
    });

    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * Test suite for waitForBlock method
     * The waitForBlock method is tested in parallel with different options, coming from the waitForBlockTestCases array
     */
    describe('waitForBlock', () => {
        test(
            'parallel waitForBlock tests',
            async () => {
                // Map each test case to a promise
                const tests = waitForBlockTestCases.map(async ({ options }) => {
                    const bestBlock =
                        await thorClient.blocks.getBestBlockCompressed();
                    if (bestBlock != null) {
                        const expectedBlock =
                            await thorClient.blocks.waitForBlock(
                                bestBlock?.number + 1,
                                options
                            );

                        // Incorporate the description into the assertion message for clarity
                        expect(expectedBlock?.number).toBeGreaterThan(
                            bestBlock?.number
                        );
                    }
                });

                // Wait for all tests to complete
                await Promise.all(tests);
            },
            12000 * waitForBlockTestCases.length
        );
    });

    test('waitForBlock - invalid blockNumber', async () => {
        await expect(
            async () => await thorClient.blocks.waitForBlock(-2)
        ).rejects.toThrowError(
            'Invalid blockNumber. The blockNumber must be a number representing a block number.'
        );
    }, 5000);

    test('waitForBlock - maximumWaitingTimeInMilliseconds', async () => {
        // Get best block
        const bestBlock = await thorClient.blocks.getBestBlockCompressed();
        if (bestBlock != null) {
            const block = await thorClient.blocks.waitForBlock(
                bestBlock?.number + 2,
                {
                    timeoutMs: 1000
                }
            );

            expect(block).toBeDefined();
            expect(block?.number).not.toBeGreaterThan(bestBlock?.number + 1); // Not enough time to wait for the block (only 1 second was given)
        }
    }, 23000);

    /**
     * getBlockCompressed tests
     */
    describe('getBlockCompressed', () => {
        /**
         * getBlockCompressed tests with revision block number or block id
         */
        validCompressedBlockRevisions.forEach(({ revision, expected }) => {
            test(
                revision,
                async () => {
                    const blockDetails =
                        await thorClient.blocks.getBlockCompressed(revision);
                    expect(blockDetails).toEqual(expected);
                },
                5000
            );
        });

        /**
         * getBlockExpanded tests with revision block number or block id
         */
        validExpandedBlockRevisions.forEach(({ revision, expected }) => {
            test(
                revision,
                async () => {
                    const blockDetails =
                        await thorClient.blocks.getBlockExpanded(revision);
                    expect(blockDetails).toEqual(expected);
                },
                5000
            );
        });

        /**
         * getBlockCompressed tests with invalid revision block number or block id
         */
        invalidBlockRevisions.forEach(
            ({ description, revision, expectedError }) => {
                test(
                    description,
                    async () => {
                        await expect(
                            thorClient.blocks.getBlockCompressed(revision)
                        ).rejects.toThrowError(expectedError);
                    },
                    5000
                );
            }
        );

        /**
         * getBlockCompressed tests with invalid revision block number or block id
         */
        invalidBlockRevisions.forEach(
            ({ description, revision, expectedError }) => {
                test(
                    description,
                    async () => {
                        await expect(
                            thorClient.blocks.getBlockExpanded(revision)
                        ).rejects.toThrowError(expectedError);
                    },
                    5000
                );
            }
        );

        /**
         * getBestBlockCompressed test
         */
        test('getBestBlockCompressed', async () => {
            const blockDetails =
                await thorClient.blocks.getBestBlockCompressed();
            if (blockDetails != null) {
                const block = await thorClient.blocks.getBlockCompressed(
                    blockDetails.number
                );
                expect(block?.number).toBe(blockDetails.number);
            }
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        }, 3000);

        /**
         * getBestBlockExpanded test
         */
        test('getBestBlockExpanded', async () => {
            const blockDetails = await thorClient.blocks.getBestBlockExpanded();
            if (blockDetails != null) {
                const block = await thorClient.blocks.getBlockExpanded(
                    blockDetails.number
                );
                expect(block?.number).toBe(blockDetails.number);
            }
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        }, 3000);

        /**
         * getBestBlockRef test
         */
        test('getBestBlockRef', async () => {
            const bestBlockRef = await thorClient.blocks.getBestBlockRef();
            expect(bestBlockRef).not.toBeNull();
            expect(bestBlockRef).toBeDefined();
        }, 3000);

        /**
         * getFinalBlock test
         */
        test('getFinalBlock', async () => {
            const blockDetails = await thorClient.blocks.getFinalBlock();
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        }, 3000);

        /**
         * getHeadBlock test
         */
        test('getHeadBlock', async () => {
            const headBlockFirst = await Poll.SyncPoll(() =>
                thorClient.blocks.getHeadBlock()
            ).waitUntil((result) => {
                return result !== null;
            });

            expect(headBlockFirst).toBeDefined();

            // Wait for the next block
            const headBlockSecond = await Poll.SyncPoll(() =>
                thorClient.blocks.getHeadBlock()
            ).waitUntil((result) => {
                return result !== headBlockFirst;
            });

            expect(headBlockSecond).toBeDefined();
            expect(headBlockFirst).not.toBe(headBlockSecond);
        }, 23000);

        /**
         * getGenesisBlock test
         */
        test('getGenesisBlock', async () => {
            const blockDetails = await thorClient.blocks.getGenesisBlock();
            expect(blockDetails).toBeDefined();
            expect(blockDetails?.number).toBe(0);
            expect(blockDetails?.id).toStrictEqual(
                networkInfo.testnet.genesisBlock.id
            );
        });
    });
});
