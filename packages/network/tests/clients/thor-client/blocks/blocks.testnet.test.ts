import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../../../../src';
import { ThorClient } from '../../../../src/clients/thor-client';
import { thorestClient } from '../../../fixture';

/**
 * Node unit tests
 * @group unit/clients/thor-client/blocks
 *
 */
describe('ThorClient - Blocks', () => {
    test('waitForBlock', async () => {
        const bestBlock = await thorestClient.blocks.getBestBlock();
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
});
