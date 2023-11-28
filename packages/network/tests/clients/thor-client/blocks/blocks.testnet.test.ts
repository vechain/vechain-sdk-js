import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../../../../src';
import { ThorClient } from '../../../../src/clients/thor-client';
import { thorestClient } from '../../../fixture';

/**
 * Blocks integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
describe('ThorClient - Blocks', () => {
    test('waitForBlock - valid', async () => {
        // Get best block
        const bestBlock = await thorestClient.blocks.getBestBlock();
        // Create ThorClient
        const thorClient = new ThorClient(
            new HttpClient('https://testnet.vechain.org/')
        );
        if (bestBlock != null) {
            const expectedBlock = await thorClient.blocks.waitForBlock(
                bestBlock?.number + 2
            );
            expect(expectedBlock?.number).toBe(bestBlock?.number + 2);
        }
    }, 25000);

    test('waitForBlock - invalid blockNumber', async () => {
        // Create ThorClient
        const thorClient = new ThorClient(
            new HttpClient('https://testnet.vechain.org/')
        );
        await expect(
            async () => await thorClient.blocks.waitForBlock(1)
        ).rejects.toThrowError(
            'Invalid blockNumber. The blockNumber must be a number representing a block number in the future.'
        );
    });
});
