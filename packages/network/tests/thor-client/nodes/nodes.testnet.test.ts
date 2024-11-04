import { describe, expect, test } from '@jest/globals';
import { InvalidHTTPRequest } from '@vechain/sdk-errors';
import { TESTNET_URL, ThorClient } from '../../../src';

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
        const thorClient = ThorClient.at(TESTNET_URL);
        const peerNodes = await thorClient.nodes.getNodes();

        expect(peerNodes).toBeDefined();
        expect(Array.isArray(peerNodes)).toBe(true);
    }, 3000);

    test('valid URL but inaccessible VeChain node', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = ThorClient.at('http://www.google.ie');

        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidHTTPRequest
        );
    }, 5000);

    test('null or empty URL or blank URL', async () => {
        let thorClient = ThorClient.at('');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidHTTPRequest
        );

        thorClient = ThorClient.at('   ');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidHTTPRequest
        );
    });

    test('invalid URL', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = ThorClient.at('INVALID_URL');

        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidHTTPRequest
        );
    });

    test('valid and available synchronized node', async () => {
        const thorClient = ThorClient.at('https://testnet.vechain.org/');

        const healthyNode = await thorClient.nodes.isHealthy();
        expect(healthyNode).toBe(true);
    }, 10000);

    test('null or empty URL or blank URL', async () => {
        let thorClient = ThorClient.at('');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidHTTPRequest
        );

        thorClient = ThorClient.at('   ');
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidHTTPRequest
        );
    });
});
