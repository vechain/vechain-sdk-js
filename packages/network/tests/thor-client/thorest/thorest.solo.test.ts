import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { ThorClient } from '../../../src';
import { soloNetwork } from '../../fixture';

/**
 * ThorestClient integration tests
 *
 * @group integration/clients/thor-client/thorest
 */
describe('ThorestClient', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(soloNetwork);
    });

    afterEach(() => {
        thorClient.destroy();
    });

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
