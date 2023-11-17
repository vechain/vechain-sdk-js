import { describe, expect, test } from '@jest/globals';
import { thorestClient } from '../../../fixture';

/**
 * ThorestClient class tests
 *
 * @group integration/clients/thorest-client/nodes
 */
describe('ThorestClient - Nodes', () => {
    /**
     * getNodes tests
     */
    describe('getNodes', () => {
        /**
         * Should return an array of nodes or an empty array
         */
        test('Should get nodes', async () => {
            const peerNodes = await thorestClient.nodes.getNodes();
            expect(peerNodes).toBeDefined();
            expect(Array.isArray(peerNodes)).toBe(true);
        });
    });
});
