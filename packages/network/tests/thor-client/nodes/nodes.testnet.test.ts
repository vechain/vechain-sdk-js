import { describe, expect, test } from '@jest/globals';
import { HTTPClientError } from '@vechain/sdk-errors';
import { TESTNET_URL } from '@vechain/sdk-constant';
import { ThorClient } from '../../../src';

/**
 * Node integration tests
 * @group integration/clients/thor-client/nodes
 */
describe('ThorClient - Nodes Module', () => {
    /**
     * Should return an array of nodes or an empty array
     */
    test('Should get nodes', async () => {
        /**
         *  client required accessing a node
         *  @internal
         */
        const thorClient = ThorClient.fromUrl(TESTNET_URL);
        const peerNodes = await thorClient.nodes.getNodes();

        expect(peerNodes).toBeDefined();
        expect(Array.isArray(peerNodes)).toBe(true);
    }, 3000);

    test('valid URL but inaccessible VeChain node', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = ThorClient.fromUrl('http://www.google.ie');

        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    }, 5000);

    test('invalid URL', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = ThorClient.fromUrl('INVALID_URL');

        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    });

    test('valid and available synchronized node', async () => {
        const thorClient = ThorClient.fromUrl('https://testnet.vechain.org/');

        const healthyNode = await thorClient.nodes.isHealthy();
        expect(healthyNode).toBe(true);
    }, 10000);

    test('null or empty URL or blank URL', async () => {
        let thorClient = ThorClient.fromUrl('');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );

        thorClient = ThorClient.fromUrl('   ');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    });
});
