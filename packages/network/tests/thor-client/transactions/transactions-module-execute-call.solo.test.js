"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
const test_utils_1 = require("../../test-utils");
/**
 * Tests for the executeCall method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module Execute Call', () => {
    let thorSoloClient;
    let accountDispatcher;
    const testContractABI = sdk_core_1.ABIContract.ofAbi((0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ABI);
    const testContractAddress = (0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ADDRESS;
    const getBalanceFn = testContractABI.getFunction('getBalance');
    beforeAll(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        accountDispatcher = sdk_solo_setup_1.AccountDispatcher.getInstance();
    });
    (0, globals_1.test)('ok <- Execute call for testing contract', async () => {
        // setup options
        const options = {
            gas: 1000000
        };
        // execute the transaction with retry logic
        const result = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeCall(testContractAddress, getBalanceFn, [accountDispatcher.getNextAccount().address], options));
        (0, globals_1.expect)(result.success).toBe(true);
    });
});
