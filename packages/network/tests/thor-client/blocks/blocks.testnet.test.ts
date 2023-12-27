import { beforeEach, afterEach, describe, expect, test } from '@jest/globals';
import {
    invalidBlockRevisions,
    validBlockRevisions,
    waitForBlockTestCases
} from './fixture';
import { HttpClient, Poll, ThorClient } from '../../../src';
import { _testnetUrl } from '../../fixture';

/**
 * Blocks Module integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
describe('Blocks Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(new HttpClient(_testnetUrl));
    });

    afterEach(() => {
        thorClient.destroy();
    });
    /**
     * Test suite for waitForBlock method
     */
    describe('waitForBlock', () => {
        waitForBlockTestCases.forEach(({ description, options }) => {
            test(
                description,
                async () => {
                    // Get best block
                    const bestBlock = await thorClient.blocks.getBestBlock();
                    if (bestBlock != null) {
                        const expectedBlock =
                            await thorClient.blocks.waitForBlock(
                                bestBlock?.number + 1,
                                options
                            );
                        expect(expectedBlock?.number).toBeGreaterThan(
                            bestBlock?.number
                        );
                    }
                },
                15000
            );
        });
    });

    test('waitForBlock - invalid blockNumber', async () => {
        await expect(
            async () => await thorClient.blocks.waitForBlock(-2)
        ).rejects.toThrowError(
            'Invalid blockNumber. The blockNumber must be a number representing a block number.'
        );
    });

    test('waitForBlock - maximumWaitingTimeInMilliseconds', async () => {
        // Get best block
        const bestBlock = await thorClient.blocks.getBestBlock();
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
    });

    /**
     * getBlock tests
     */
    describe('getBlock', () => {
        /**
         * getBlock tests with revision block number or block id
         */
        validBlockRevisions.forEach(({ revision, expanded, expected }) => {
            test(revision, async () => {
                const blockDetails = await thorClient.blocks.getBlock(
                    revision,
                    {
                        expanded
                    }
                );
                expect(blockDetails).toEqual(expected);
            });
        });

        /**
         * getBlock tests with invalid revision block number or block id
         */
        invalidBlockRevisions.forEach(
            ({ description, revision, expectedError }) => {
                test(description, async () => {
                    await expect(
                        thorClient.blocks.getBlock(revision)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );

        /**
         * getBestBlock test
         */
        test('getBestBlock', async () => {
            const blockDetails = await thorClient.blocks.getBestBlock();
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        });

        /**
         * getBestBlockRef test
         */
        test('getBestBlockRef', async () => {
            const bestBlockRef = await thorClient.blocks.getBestBlockRef();
            expect(bestBlockRef).not.toBeNull();
            expect(bestBlockRef).toBeDefined();
        });

        /**
         * getFinalBlock test
         */
        test('getFinalBlock', async () => {
            const blockDetails = await thorClient.blocks.getFinalBlock();
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        });
    });

    test('getHeadBlock', async () => {
        const headBlockFirst = await Poll.SyncPoll(() =>
            thorClient.blocks.getHeadBlock()
        ).waitUntil((result) => {
            return result !== null;
        });

        expect(headBlockFirst).toBeDefined();

        // Wait for 15 seconds with promise
        await new Promise((resolve) => setTimeout(resolve, 10000));

        const headBlockSecond = thorClient.blocks.getHeadBlock();

        expect(headBlockSecond).toBeDefined();
        expect(headBlockFirst).not.toBe(headBlockSecond);
    }, 23000);
});
