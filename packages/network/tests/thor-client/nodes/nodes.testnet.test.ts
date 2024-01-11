import { describe, expect, test } from '@jest/globals';
import { HTTPClientError } from '@vechain/vechain-sdk-errors';
import { testNetwork } from '../../fixture';
import { HttpClient, ThorClient } from '../../../src';
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
         *  client required to access a node
         *  @internal
         */
        const thorClient = new ThorClient(testNetwork);
        const peerNodes = await thorClient.nodes.getNodes();
        thorClient.destroy();
        expect(peerNodes).toBeDefined();
        expect(Array.isArray(peerNodes)).toBe(true);
    }, 3000);

    test('valid URL but inaccessible vechain node', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const testNetwork = new HttpClient('http://www.google.ie');
        const thorClient = new ThorClient(testNetwork);
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );

        thorClient.destroy();
    }, 3000);

    test('invalid URL', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const testNetwork = new HttpClient('INVALID_URL');
        const thorClient = new ThorClient(testNetwork);
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );

        thorClient.destroy();
    });

    test('valid and available synchronized node', async () => {
        const testNetwork = new HttpClient('https://testnet.vechain.org/');
        const thorClient = new ThorClient(testNetwork);
        const healthyNode = await thorClient.nodes.isHealthy();
        expect(healthyNode).toBe(true);

        thorClient.destroy();
    }, 10000);

    test('null or empty URL or blank URL', async () => {
        let testNetwork = new HttpClient('');
        let thorClient = new ThorClient(testNetwork);
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );

        testNetwork = new HttpClient('   ');
        thorClient = new ThorClient(testNetwork);
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );

        thorClient.destroy();
    });
});
