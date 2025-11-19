"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
const test_utils_1 = require("../../test-utils");
/**
 * Tests for the executeMultipleClausesCall method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module Execute Call', () => {
    let thorSoloClient;
    let accountDispatcher;
    let account;
    const testContractABI = sdk_core_1.ABIContract.ofAbi((0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ABI);
    const testContractAddress = (0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ADDRESS;
    const getBalanceFn = testContractABI.getFunction('getBalance');
    const greaterThan10Fn = testContractABI.getFunction('testRequireError');
    beforeAll(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        accountDispatcher = sdk_solo_setup_1.AccountDispatcher.getInstance();
        account = accountDispatcher.getNextAccount();
    });
    (0, globals_1.test)('ok <- Execute multiple call for testing contract', async () => {
        // setup options
        const options = {
            gas: 1000000
        };
        // setup clauses
        const clauses = [
            {
                clause: {
                    to: testContractAddress,
                    data: getBalanceFn.encodeData([account.address]).toString(),
                    value: '0x0'
                },
                functionAbi: getBalanceFn
            },
            {
                clause: {
                    to: testContractAddress,
                    data: greaterThan10Fn.encodeData([100]).toString(),
                    value: '0x0'
                },
                functionAbi: greaterThan10Fn
            }
        ];
        // execute the transaction with retry logic
        const result = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeMultipleClausesCall(clauses, options));
        (0, globals_1.expect)(result[0].success).toBe(true);
        (0, globals_1.expect)(result[1].success).toBe(true);
    });
});
