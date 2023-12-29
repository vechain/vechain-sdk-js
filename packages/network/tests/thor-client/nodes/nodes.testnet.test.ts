import { describe, expect, test } from '@jest/globals';
import { createThorClient } from './fixture';
import { HTTPClientError } from '@vechainfoundation/vechain-sdk-errors';
import { thorClient } from '../../fixture';
/**
 * Node integration tests
 * @group integration/clients/thor-client/nodes
 */
describe('Integration tests to check the Node health check for different scenarios', () => {
    /**
     * Should return an array of nodes or an empty array
     */
    test('Should get nodes', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const peerNodes = await thorClient.nodes.getNodes();
        expect(peerNodes).toBeDefined();
        expect(Array.isArray(peerNodes)).toBe(true);
    });

    test('valid URL but inaccessible vechain node', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = createThorClient('http://www.google.ie');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    });

    test('invalid URL', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = createThorClient('INVALID_URL');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    });

    test('valid and available synchronized node', async () => {
        const thorClient = createThorClient('https://testnet.vechain.org/');
        const healthyNode = await thorClient.nodes.isHealthy();
        expect(healthyNode).toBe(true);
    });

    test('null or empty URL or blank URL', async () => {
        let thorClient = createThorClient('');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
        thorClient = createThorClient('   ');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    });
});
