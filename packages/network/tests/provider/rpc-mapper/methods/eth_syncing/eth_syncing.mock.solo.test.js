"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_syncing' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/eth_syncing
 */
(0, globals_1.describe)('RPC Mapper - eth_syncing method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    /**
     * eth_syncing RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_syncing - Positive cases', () => {
        /**
         * Positive case 1 - NOT out of sync
         */
        (0, globals_1.test)('eth_syncing - Should return false with NOT out of sync best block', async () => {
            // Mock the getGenesisBlock method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getBestBlockCompressed').mockResolvedValue(fixture_1.mockedNotOutOfSyncBestBlockFixture);
            const status = await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_syncing]([]));
            (0, globals_1.expect)(status).toBe(false);
        });
        /**
         * Positive case 2 - OUT of sync
         */
        (0, globals_1.test)('eth_syncing - Should return sync status with out of sync best block', async () => {
            // Mock the getGenesisBlock method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getBestBlockCompressed').mockResolvedValue(fixture_1.mockedOutOfSyncBestBlockFixture);
            const status = await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_syncing]([]));
            (0, globals_1.expect)(status).not.toBe(false);
            (0, globals_1.expect)(status).toHaveProperty('currentBlock');
            (0, globals_1.expect)(status).toHaveProperty('highestBlock');
            (0, globals_1.expect)(status).toHaveProperty('startingBlock');
        });
    });
    /**
     * eth_syncing RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_syncing - Negative cases', () => {
        /**
         * Cases when error is thrown
         */
        (0, globals_1.describe)('eth_syncing - Error throws', () => {
            /**
             * Test case that mocks an error thrown by the getBestBlock method
             */
            (0, globals_1.test)('Should throw `JSONRPCInternalError` if an error occurs while retrieving the best block', async () => {
                // Mock the getGenesisBlock method to return null
                globals_1.jest.spyOn(thorClient.blocks, 'getBestBlockCompressed').mockRejectedValue(new Error());
                await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_syncing]([]))).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
            });
            /**
             * Test case that mocks an error thrown by the getGenesisBlock method
             */
            (0, globals_1.test)('Should throw `JSONRPCInternalError` if an error occurs while retrieving the genesis block', async () => {
                // Mock the getGenesisBlock method to return null
                globals_1.jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockRejectedValue(new Error());
                await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_syncing]([]))).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
            });
            /**
             * Cases when error is thrown
             */
            (0, globals_1.describe)('eth_syncing - Null values fetched for best and genesis block', () => {
                /**
                 * Test case where the best block and genesis block are not defined
                 */
                (0, globals_1.test)('Should return an object with the sync status of the node if the node is out-of-sync and with null best and genesis block', async () => {
                    // Mock the getBestBlock method to return null
                    globals_1.jest.spyOn(thorClient.blocks, 'getBestBlockCompressed').mockResolvedValue(null);
                    // Mock the getGenesisBlock method to return null
                    globals_1.jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockResolvedValue(null);
                    const status = (await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_syncing]([])));
                    (0, globals_1.expect)(status).not.toBe(false);
                });
            });
        });
    });
});
