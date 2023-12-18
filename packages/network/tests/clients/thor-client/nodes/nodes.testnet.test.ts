import { describe, expect, test } from '@jest/globals';
import { createThorClient } from './fixture';
import { HTTPClientError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Node integration tests
 * @group integration/clients/thor-client/nodes
 */
describe('Integration tests to check the Node health check for different scenarios', () => {
    test('valid URL but inaccessible VeChain node', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = createThorClient('http://www.google.ie');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );

        thorClient.destroy();
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

        thorClient.destroy();
    });

    test('valid and available synchronized node', async () => {
        const thorClient = createThorClient('https://testnet.vechain.org/');
        const healthyNode = await thorClient.nodes.isHealthy();
        expect(healthyNode).toBe(true);

        thorClient.destroy();
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

        thorClient.destroy();
    });
});
