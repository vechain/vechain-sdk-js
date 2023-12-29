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
     * The waitForBlock method is tested in parallel with different options, coming from the waitForBlockTestCases array
     */
    describe('waitForBlock', () => {
        test(
            'parallel waitForBlock tests',
            async () => {
                // Map each test case to a promise
                const tests = waitForBlockTestCases.map(
                    async ({ description, options }) => {
                        try {
                            // Log the description or use it in some other meaningful way
                            console.log(`Running test: ${description}`);
                            const bestBlock =
                                await thorClient.blocks.getBestBlock();
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
                        } catch (error) {
                            // Append the description to any errors for clarity
                            console.log('error', error);
                        }
                    }
                );

                // Wait for all tests to complete
                await Promise.all(tests);
            },
            15000 * waitForBlockTestCases.length
        );
    });

    /**
     * Test suite for getBestBlock method, with invalid block number
     */

    test('waitForBlock - invalid blockNumber', async () => {
        await expect(
            async () => await thorClient.blocks.waitForBlock(-2)
        ).rejects.toThrowError(
            'Invalid blockNumber. The blockNumber must be a number representing a block number.'
        );
    });

    /**
     * Test suite for getBestBlock method, with maximum waiting time set at 1000ms
     */
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
});
