"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_sendRawTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_sendRawTransaction-testnet
 */
(0, globals_1.describe)('RPC Mapper - eth_sendRawTransaction method tests', () => {
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
     * eth_sendRawTransaction RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_sendRawTransaction - Negative cases', () => {
        /**
         *  Invalid params - Invalid params - params number
         */
        (0, globals_1.test)('eth_sendRawTransaction - Invalid params - params number', async () => {
            await (0, globals_1.expect)(async () => {
                (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_sendRawTransaction]([]));
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         *  Invalid params - Invalid transaction decoded hex format
         */
        (0, globals_1.test)('eth_sendRawTransaction - Invalid transaction decoded hex format', async () => {
            await (0, globals_1.expect)(async () => {
                (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_sendRawTransaction](['0xINVALID']));
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         *  Invalid params - Invalid transaction decoded hex format
         */
        (0, globals_1.test)('eth_sendRawTransaction - Invalid transaction decoded', async () => {
            await (0, globals_1.expect)(async () => {
                (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_sendRawTransaction](['0xcaffe']));
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
