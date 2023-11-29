import { describe, expect, test } from '@jest/globals';
import { thorClient, thorestClient } from '../../../fixture';

/**
 * Blocks integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
describe('ThorClient - Blocks', () => {
    test('waitForBlock - valid', async () => {
        // Get best block
        const bestBlock = await thorestClient.blocks.getBestBlock();
        if (bestBlock != null) {
            const expectedBlock = await thorClient.blocks.waitForBlock(
                bestBlock?.number + 2
            );
            expect(expectedBlock?.number).toBe(bestBlock?.number + 2);
        }
    }, 25000);

    test('waitForBlock - invalid blockNumber', async () => {
        await expect(
            async () => await thorClient.blocks.waitForBlock(0)
        ).rejects.toThrowError(
            'Invalid blockNumber. The blockNumber must be a number representing a block number.'
        );
    });

    test('waitForBlock - maximumWaitingTimeInMilliseconds', async () => {
        // Get best block
        const bestBlock = await thorestClient.blocks.getBestBlock();
        if (bestBlock != null) {
            const block = await thorClient.blocks.waitForBlock(
                bestBlock?.number + 2,
                1000
            );
            expect(block).toBeDefined();
        }
    });
});
