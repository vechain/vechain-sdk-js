"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'eth_getLogs' method
 *
 * @group integration/rpc-mapper/methods/eth_getLogs
 */
(0, globals_1.describe)('RPC Mapper - eth_getLogs method tests', () => {
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
     * eth_getLogs RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getLogs - Positive cases', () => {
        /**
         * Positive cases. Should be able to get logs
         */
        fixture_1.logsFixture.forEach((fixture, index) => {
            (0, globals_1.test)(`eth_getLogs - Should be able to get logs test - ${index + 1}`, async () => {
                // Call RPC method
                const logs = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getLogs]([fixture.input]));
                (0, globals_1.expect)(logs.slice(0, 4)).toStrictEqual(fixture.expected);
            }, 6000);
        });
    });
    /**
     * eth_getLogs RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getLogs - Negative cases', () => {
        /**
         * Negative case 1 - Should throw an error for invalid input
         */
        (0, globals_1.test)('eth_getLogs - Invalid input', async () => {
            await (0, globals_1.expect)(async () => 
            // Call RPC method
            (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getLogs]([
                'INVALID_INPUT'
            ]))).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
    (0, globals_1.test)('eth_getLogs - array of an array of topics as input', async () => {
        const provider = new src_1.VeChainProvider(thorClient);
        const multiTopicsResponse = (await provider.request({
            method: 'eth_getLogs',
            params: [
                {
                    address: [
                        '0x90c1a329e11ce6429eef0ab9b8f7daab68694e7d',
                        '0x3d7616213191a10460e49cfdb7edbf88d6a10942'
                    ],
                    fromBlock: sdk_core_1.Hex.of(0).toString(),
                    toBlock: sdk_core_1.Hex.of(19000000n), // Same integer has different hex representations for bigint and number IEEE 754.
                    topics: [
                        '0xd6dd0ade89eeb414b7e63b3b71fde3db88b04f032c3d5bce15271008598f64f9',
                        [
                            '0xd6dd0ade89eeb414b7e63b3b71fde3db88b04f032c3d5bce15271008598f64f9',
                            '0x808dd6e6b8eac0877deeb0f618c8e6776fa59d4ce0ede71e3c4a41bf91e9e462'
                        ]
                    ]
                }
            ]
        }));
        (0, globals_1.expect)(multiTopicsResponse).toBeDefined();
        (0, globals_1.expect)(multiTopicsResponse.length).toBeGreaterThan(0);
    }, 15000);
});
