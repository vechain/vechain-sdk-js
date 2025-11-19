"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../../src");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/eth_chainId-mock-solo
 */
(0, globals_1.describe)('RPC Mapper - eth_chainId method tests mock on solo', () => {
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
     * eth_chainId RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_chainId - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getGenesisBlock method
         */
        (0, globals_1.test)('Should throw `ProviderRpcError` if an error occurs while retrieving the chain id', async () => {
            // Mock the getGenesisBlock method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockRejectedValue(new Error());
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_chainId]([]))).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        /**
         * Test case where the genesis block is not defined
         */
        (0, globals_1.test)('Should return `0x0` if the genesis block is not defined', async () => {
            // Mock the getGenesisBlock method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockResolvedValue(null);
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_chainId]([]))).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
