"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'web3_clientVersion' method
 *
 * @group integration/rpc-mapper/methods/web3_clientVersion
 */
(0, globals_1.describe)('RPC Mapper - web3_clientVersion method tests', () => {
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
    (0, globals_1.describe)('web3_clientVersion - Positive cases', () => {
        /**
         * Get client version
         */
        (0, globals_1.test)('web3_clientVersion - positive case 1', async () => {
            const web3ClientVersion = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.web3_clientVersion]([]);
            (0, globals_1.expect)(web3ClientVersion).toBe('thor');
        });
    });
});
