"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const test_utils_1 = require("../../test-utils");
/**
 * Node integration tests
 * @group integration/clients/thor-client/nodes
 */
(0, globals_1.describe)('ThorClient - Nodes Module', () => {
    /**
     * Should return an array of nodes or an empty array
     */
    (0, globals_1.test)('Should get nodes', async () => {
        /**
         *  client required accessing a node
         *  @internal
         */
        const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        const peerNodes = await (0, test_utils_1.retryOperation)(async () => {
            return await thorClient.nodes.getNodes();
        });
        (0, globals_1.expect)(peerNodes).toBeDefined();
        (0, globals_1.expect)(Array.isArray(peerNodes)).toBe(true);
    }, 15000);
    (0, globals_1.test)('valid URL but inaccessible VeChain node', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = src_1.ThorClient.at('https://www.google.ie');
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidHTTPRequest);
    }, 5000);
    (0, globals_1.test)('null or empty URL or blank URL', async () => {
        let thorClient = src_1.ThorClient.at('');
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidHTTPParams);
        thorClient = src_1.ThorClient.at('   ');
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidHTTPParams);
    });
    (0, globals_1.test)('invalid URL', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = src_1.ThorClient.at('INVALID_URL');
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidHTTPParams);
    });
    (0, globals_1.test)('valid and available synchronized node', async () => {
        const thorClient = src_1.ThorClient.at('https://testnet.vechain.org/');
        const healthyNode = await thorClient.nodes.isHealthy();
        (0, globals_1.expect)(healthyNode).toBe(true);
    }, 10000);
    (0, globals_1.test)('null or empty URL or blank URL', async () => {
        let thorClient = src_1.ThorClient.at('');
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidHTTPParams);
        thorClient = src_1.ThorClient.at('   ');
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidHTTPParams);
    });
});
