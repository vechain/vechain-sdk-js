import { describe, expect, test } from '@jest/globals';
import { thorClient } from '../../../fixture';

/**
 * ThorestClient integration tests
 *
 * @group integration/clients/thor-client/thorest
 */
describe('ThorestClient', () => {
    test('getBestBlock method', async () => {
        const bestBlock = await thorClient.thorest?.blocks.getBestBlock();
        expect(bestBlock).toBeDefined();
    });

    test('getBlock method', async () => {
        const bestBlock = await thorClient.thorest?.blocks.getBestBlock();
        if (bestBlock != null) {
            const block = await thorClient.thorest?.blocks.getBlock(
                bestBlock.number
            );
            expect(block?.number).toBe(bestBlock.number);
        }
    });
});
