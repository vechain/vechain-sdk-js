import { describe, expect, test } from '@jest/globals';
import { thorClient } from '../../../fixture';

/**
 * ThorestClient integration tests
 *
 * @group integration/clients/thor-client/thorest
 */
describe('ThorestClient', () => {
    test('getBestBlock method', async () => {
        const bestBlock = await thorClient.blocks.getBestBlock();
        expect(bestBlock).toBeDefined();
    });

    test('getBlock method', async () => {
        const bestBlock = await thorClient.blocks.getBestBlock();
        if (bestBlock != null) {
            const block = await thorClient.blocks.getBlock(bestBlock.number);
            expect(block?.number).toBe(bestBlock.number);
        }
    });
});
