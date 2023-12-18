import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { thorestClient } from '../../../fixture';
import { ThorClient } from '../../../../src';

/**
 * ThorestClient integration tests
 *
 * @group integration/clients/thor-client/thorest
 */
describe('ThorestClient', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(thorestClient);
    });

    afterEach(() => {
        thorClient.destroy();
    });

    test('getBestBlock method', async () => {
        const bestBlock = await thorClient.thorest.blocks.getBestBlock();
        expect(bestBlock).toBeDefined();
    });

    test('getBlock method', async () => {
        const bestBlock = await thorClient.thorest.blocks.getBestBlock();
        if (bestBlock != null) {
            const block = await thorClient.thorest.blocks.getBlock(
                bestBlock.number
            );
            expect(block?.number).toBe(bestBlock.number);
        }
    });
});
