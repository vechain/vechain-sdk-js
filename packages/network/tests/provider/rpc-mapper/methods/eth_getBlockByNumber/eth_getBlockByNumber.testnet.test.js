"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_core_1 = require("@vechain/sdk-core");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_getBlockByNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockByNumber
 */
(0, globals_1.describe)('RPC Mapper - eth_getBlockByNumber method tests', () => {
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
     * eth_getBlockByNumber RPC call tests - Positive cases
     */
    (0, globals_1.describe)('Positive cases', () => {
        /**
         * Test cases for eth_getBlockByNumber RPC method
         */
        fixture_1.ethGetBlockByNumberTestCases.forEach(({ description, params, expected }) => {
            (0, globals_1.test)(description, async () => {
                // Call RPC function
                const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](params);
                // Compare the result with the expected value
                (0, globals_1.expect)(rpcCall).toStrictEqual(expected);
            });
        });
        /**
         * Test case where the revision is valid but doesn't refer to an existing block
         */
        (0, globals_1.test)('Should be able to get block with `latest`', async () => {
            // Null block
            const rpcCallNullBlock = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](['latest', false]);
            (0, globals_1.expect)(rpcCallNullBlock).toBeDefined();
        });
        /**
         * Test case where the revision is valid but doesn't refer to an existing block
         */
        (0, globals_1.test)('Should be able to get block with `finalized`', async () => {
            // Null block
            const rpcCallNullBlock = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](['finalized', false]);
            (0, globals_1.expect)(rpcCallNullBlock).toBeDefined();
        });
    });
    /**
     * eth_getBlockByNumber RPC call tests - Negative cases
     */
    (0, globals_1.describe)('Negative cases', () => {
        /**
         * Invalid eth_getBlockByNumber RPC method test cases
         */
        fixture_1.invalidEthGetBlockByNumberTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                // Call RPC function
                await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](params)).rejects.toThrowError(expectedError);
            });
        });
        /**
         * Test case where the block number is negative
         */
        (0, globals_1.test)('Should throw `JSONRPCInternalError` for negative block number', async () => {
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber]([`0x${BigInt(-1).toString(16)}`, false]) // Block number is negative (-1)
            ).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
    (0, globals_1.describe)('GALACTICA - baseFeePerGas', () => {
        (0, globals_1.test)('OK <- blocks/0?expanded=false', async () => {
            const actual = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](['0x0', true]);
            (0, globals_1.expect)(actual).toBeDefined();
            const block = actual;
            (0, globals_1.expect)(block.baseFeePerGas).toBeUndefined();
        });
        (0, globals_1.test)('OK <- blocks/1?expanded=true', async () => {
            const actual = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](['0x0', true]);
            (0, globals_1.expect)(actual).toBeDefined();
            const block = actual;
            (0, globals_1.expect)(block.baseFeePerGas).toBeUndefined();
            (0, globals_1.expect)(block.transactions.length).toBe(0);
        });
        (0, globals_1.test)('OK <- blocks/22638715?expanded=false', async () => {
            const actual = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](['0x1593E7B', true]);
            (0, globals_1.expect)(actual).toBeDefined();
            const block = actual;
            (0, globals_1.expect)(block.baseFeePerGas).toBeDefined();
            (0, globals_1.expect)(block.baseFeePerGas).not.toBeNull();
            (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(block.baseFeePerGas)).toBeTruthy();
            (0, globals_1.expect)(sdk_core_1.HexUInt.of(block.baseFeePerGas).bi).toBeGreaterThan(0n);
        });
        (0, globals_1.test)('OK <- blocks/22638715?expanded=true', async () => {
            const actual = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](['0x1593E7B', true]);
            (0, globals_1.expect)(actual).toBeDefined();
            const block = actual;
            (0, globals_1.expect)(block.baseFeePerGas).toBeDefined();
            (0, globals_1.expect)(block.baseFeePerGas).not.toBeNull();
            (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(block.baseFeePerGas)).toBeTruthy();
            (0, globals_1.expect)(sdk_core_1.HexUInt.of(block.baseFeePerGas).bi).toBeGreaterThan(0n);
            block.transactions.forEach((tx) => {
                const transactionRPC = tx;
                (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(transactionRPC.type)).toBeTruthy();
                if (transactionRPC.maxFeePerGas !== undefined &&
                    transactionRPC.maxFeePerGas !== null) {
                    (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(transactionRPC.maxFeePerGas)).toBeTruthy();
                }
                if (transactionRPC.maxPriorityFeePerGas !== undefined &&
                    transactionRPC.maxPriorityFeePerGas !== null) {
                    (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(transactionRPC.maxPriorityFeePerGas)).toBeTruthy();
                }
            });
            console.log(JSON.stringify(block, null, 2));
        });
        (0, globals_1.test)('eth_getBlockByNumber', async () => {
            const block = await (0, test_utils_1.retryOperation)(async () => {
                return await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber](['latest', false]);
            });
            (0, globals_1.expect)(block).toBeDefined();
        }, 15000);
    });
});
