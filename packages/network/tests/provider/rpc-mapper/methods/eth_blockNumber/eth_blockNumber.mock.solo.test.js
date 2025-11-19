"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../../src");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_blockNumber' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/eth_blockNumber
 */
(0, globals_1.describe)('RPC Mapper - eth_blockNumber method tests', () => {
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
     * eth_blockNumber RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_blockNumber - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getBestBlock method
         */
        (0, globals_1.test)('Should throw `ProviderRpcError` if an error occurs while retrieving the block number', async () => {
            // Mock the getGenesisBlock method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getBestBlockCompressed').mockRejectedValue(new Error());
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_blockNumber]([])).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        /**
         * Test case where the best block is not defined
         */
        (0, globals_1.test)('Should return `0x0` if the genesis block is not defined', async () => {
            // Mock the getGenesisBlock method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getBestBlockCompressed').mockResolvedValue(null);
            const rpcCallChainId = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_blockNumber]([]));
            (0, globals_1.expect)(rpcCallChainId).toBe('0x0');
        });
    });
    /**
     * eth_blockNumber RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_blockNumber - Positive cases', () => {
        /**
         * Test case that returns the latest block number
         */
        (0, globals_1.test)('Should return the latest block number', async () => {
            const result = await (0, test_utils_1.retryOperation)(async () => {
                return await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_blockNumber]([]);
            });
            (0, globals_1.expect)(result).toBeDefined();
        }, 15000);
    });
});
