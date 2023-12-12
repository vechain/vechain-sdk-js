import { describe, expect, test, jest } from '@jest/globals';
import { thorClient } from '../../../fixture';
import { waitForBlockTestCases } from './fixture';

/**
 * Blocks Module integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
describe('Blocks Module', () => {
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

    test('pollHeadBlock', async () => {
        // To mock setTimeouts we need to use jest fake timers which allow to manpilate time and test asynchronicity
        jest.useFakeTimers({
            legacyFakeTimers: true
        });
        const headBlockFirst = thorClient.blocks.getHeadBlock();
        expect(headBlockFirst).toBeDefined();
        console.log('headBlockFirst', headBlockFirst);

        // wait for 10 seconds with promise
        await new Promise((resolve) => setTimeout(resolve, 10000));

        const headBlockSecond = thorClient.blocks.getHeadBlock();
        expect(headBlockSecond).toBeDefined();
        console.log('headBlockSecond', headBlockSecond);
        expect(headBlockFirst).not.toBe(headBlockSecond);
    }, 20000);
});
