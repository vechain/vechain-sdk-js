"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("../../../../fixture");
const sdk_core_1 = require("@vechain/sdk-core");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_accounts' method
 *
 * @group integration/rpc-mapper/methods/eth_accounts
 */
(0, globals_1.describe)('RPC Mapper - eth_accounts method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Provider instance
     */
    let provider;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        // Init provider
        provider = new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)());
    });
    /**
     * eth_accounts RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_accounts - Positive cases', () => {
        /**
         * Positive case 1 - Should be able to get addresses from a NON-empty wallet
         */
        (0, globals_1.test)('eth_accounts - Should be able to get addresses from a NON-empty wallet', async () => {
            // Get accounts - Instead of using RPCMethodsMap, we can use provider directly
            const accounts = (await (0, test_utils_1.retryOperation)(async () => await provider.request({
                method: src_1.RPC_METHODS.eth_accounts,
                params: []
            }))).map((account) => sdk_core_1.Address.of(account));
            // Check if the accounts are the same
            (0, globals_1.expect)(accounts.length).toBeGreaterThan(0);
        });
    });
    /**
     * eth_accounts RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_accounts - Negative cases', () => {
        /**
         * Negative case 1 - Should return empty array if wallet is not given
         */
        (0, globals_1.test)('eth_accounts - Should return empty array if wallet is not given', async () => {
            // Get accounts (NO WALLET GIVEN)
            const accounts = (await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_accounts]([])));
            // Check if the accounts are the same
            (0, globals_1.expect)(accounts.length).toBe(0);
            (0, globals_1.expect)(accounts).toEqual([]);
        });
    });
});
