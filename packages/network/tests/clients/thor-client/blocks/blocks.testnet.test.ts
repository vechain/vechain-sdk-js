import { describe, expect, test } from '@jest/globals';
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
        const bestBlock = await thorClient.thorest.blocks.getBestBlock();
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
});
