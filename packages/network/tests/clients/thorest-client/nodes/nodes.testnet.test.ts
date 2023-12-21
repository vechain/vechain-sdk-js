import { describe, expect, test } from '@jest/globals';
import { thorestClient } from '../../../fixture';
import { ThorClient } from '../../../../src';

/**
 * ThorestClient class tests
 *
 * @group integration/clients/thorest-client/nodes
 */
describe('ThorestClient - Nodes', () => {
    const thorClient = new ThorClient(thorestClient);
    /**
     * getNodes tests
     */
    describe('getNodes', () => {
        /**
         * Should return an array of nodes or an empty array
         */
        test('Should get nodes', async () => {
            const peerNodes = await thorClient.nodes.getNodes();
            expect(peerNodes).toBeDefined();
            expect(Array.isArray(peerNodes)).toBe(true);
        });
    });
});
