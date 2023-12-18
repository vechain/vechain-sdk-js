import { beforeEach, describe, expect, test } from '@jest/globals';
import { ThorClient } from '../../../../src';
import { waitForBlockTestCases } from './fixture';
import { thorestClient } from '../../../fixture';

/**
 * Blocks Module integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
describe('Blocks Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(thorestClient);
    });

    // afterEach(() => {
    //     thorClient.blocks.destroy();
    // });

    /**
     * Test suite for waitForBlock method
     */
    describe('waitForBlock', () => {
        waitForBlockTestCases.forEach(({ description, options }) => {
            test(
                description,
                async () => {
                    // Get best block
                    const bestBlock =
                        await thorClient.thorest.blocks.getBestBlock();
                    if (bestBlock != null) {
                        const expectedBlock =
                            await thorClient.blocks.waitForBlock(
                                bestBlock?.number + 1,
                                options
                            );
                        expect(expectedBlock?.number).toBe(
                            bestBlock?.number + 1
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
        const bestBlock = await thorClient.thorest.blocks.getBestBlock();
        if (bestBlock != null) {
            const block = await thorClient.blocks.waitForBlock(
                bestBlock?.number + 2,
                {
                    timeoutMs: 1000
                }
            );
            expect(block).toBeDefined();
        }
    });

    // test('getHeadBlock', async () => {
    //     const headBlockFirst = await Poll.SyncPoll(() =>
    //         thorClient.blocks.getHeadBlock()
    //     ).waitUntil((result) => {
    //         return result !== null;
    //     });

    //     expect(headBlockFirst).toBeDefined();

    //     // Wait for 5 seconds with promise
    //     await new Promise((resolve) => setTimeout(resolve, 5000));

    //     const headBlockSecond = thorClient.blocks.getHeadBlock();
    //     expect(headBlockSecond).toBeDefined();
    //     expect(headBlockFirst).not.toBe(headBlockSecond);
    // }, 12000);
});
