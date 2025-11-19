"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_getBlockReceipts' method
 *
 * @group integration/sdk-network/rpc-mapper/methods/eth_getBlockReceipts
 */
(0, globals_1.describe)('RPC Mapper - eth_getBlockReceipts method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
    });
    /**
     * eth_getBlockReceipts RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getBlockReceipts - Positive cases', () => {
        /**
         * Positive case 1 - Simple block receipts retrieval
         */
        (0, globals_1.test)('Should be able to get block receipts', async () => {
            for (const fixture of fixture_1.blockReceiptsFixture) {
                // Call RPC function
                const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockReceipts]([fixture.blockNumber]);
                // Compare the result with the expected value
                (0, globals_1.expect)(rpcCall).toEqual(fixture.expected);
            }
        }, 20000);
        /**
         * Should retrieve receipts for specific block hash 0x015395abb2644d21d6f15c9e2b616a190e1a9d01259ba895d6f99ece4f99e2f0
         */
        (0, globals_1.test)('Should retrieve receipts for specific block hash', async () => {
            const blockHash = fixture_1.blockHashReceiptsFixture.blockHash;
            const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockReceipts]([blockHash]);
            // Compare the result with the expected value
            (0, globals_1.expect)(rpcCall).toBeDefined();
        }, 20000);
    });
    (0, globals_1.describe)('eth_getBlockReceipts - with tags', () => {
        /**
         * Throw error if RPC parameters are invalid
         */
        (0, globals_1.test)('Should get block based on tags', async () => {
            for (const fixture of [
                'earliest',
                'latest',
                'safe',
                'finalized',
                'pending'
            ]) {
                const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockReceipts]([fixture]);
                (0, globals_1.expect)(rpcCall).toBeDefined();
            }
        });
    });
    /**
     * eth_getBlockReceipts RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getBlockReceipts - Negative cases', () => {
        /**
         * Throw error if RPC parameters are invalid
         */
        (0, globals_1.test)('Should throw error with invalid parameters', async () => {
            for (const fixture of fixture_1.blockReceiptsInvalidFixture) {
                await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockReceipts]([fixture])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            }
        });
    });
    /**
     * Test for specific block hash 0x015395abb2644d21d6f15c9e2b616a190e1a9d01259ba895d6f99ece4f99e2f0
     */
    (0, globals_1.test)('Should retrieve receipts for specific block hash 0x015395abb2644d21d6f15c9e2b616a190e1a9d01259ba895d6f99ece4f99e2f0', async () => {
        // Call RPC function with the specific block hash
        const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockReceipts]([fixture_1.blockHashReceiptsFixture.blockHash]);
        // Check that we got a response
        (0, globals_1.expect)(rpcCall).toBeDefined();
        // If receipts are returned (not null), verify they have the correct structure
        if (rpcCall !== null) {
            // Verify it's an array
            (0, globals_1.expect)(Array.isArray(rpcCall)).toBe(true);
            // Type guard for TypeScript
            if (Array.isArray(rpcCall) && rpcCall.length > 0) {
                // If there are receipts, verify their structure
                for (const receipt of rpcCall) {
                    (0, globals_1.expect)(receipt).toHaveProperty('blockHash');
                    (0, globals_1.expect)(receipt).toHaveProperty('blockNumber');
                    (0, globals_1.expect)(receipt).toHaveProperty('transactionHash');
                    (0, globals_1.expect)(receipt).toHaveProperty('status');
                    (0, globals_1.expect)(receipt).toHaveProperty('logs');
                }
            }
        }
    }, 20000);
});
