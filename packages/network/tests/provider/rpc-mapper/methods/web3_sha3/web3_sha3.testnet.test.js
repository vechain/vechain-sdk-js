"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'web3_sha3' method
 *
 * @group integration/rpc-mapper/methods/web3_sha3
 */
(0, globals_1.describe)('RPC Mapper - web3_sha3 method tests', () => {
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
     * web3_clientVersion RPC call tests - Positive cases
     */
    (0, globals_1.describe)('web3_sha3 - Positive cases', () => {
        /**
         * Should be able to calculate web3_sha3
         */
        (0, globals_1.test)('Should be able to calculate web3_sha3', async () => {
            const web3Sha3 = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.web3_sha3](['0x68656c6c6f20776f726c64']);
            (0, globals_1.expect)(web3Sha3).toBe('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad');
        });
    });
    /**
     * web3_clientVersion RPC call tests - Negative cases
     */
    (0, globals_1.describe)('web3_sha3 - Negative cases', () => {
        /**
         * Should NOT be able to calculate web3_sha3 of invalid hex
         */
        (0, globals_1.test)('Should NOT be able to calculate web3_sha3 of invalid hex', async () => {
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.web3_sha3]([
                'INVALID_HEX'
            ])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Should NOT be able to calculate web3_sha3 of invalid params
         */
        (0, globals_1.test)('Should NOT be able to calculate web3_sha3 of invalid params', async () => {
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.web3_sha3]([])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
