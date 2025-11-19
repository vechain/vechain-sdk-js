"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../src");
const Transaction_unit_test_1 = require("../../../../../core/tests/transaction/Transaction.unit.test");
const fixture_1 = require("./fixture");
/**
 * DelegationHandler helper function tests.
 * Testing the DelegationHandler helper function.
 *
 * @group unit/thor-client/transactions/helpers/delegation-handler
 */
(0, globals_1.describe)('Tests of DelegationHandler helper function', () => {
    /**
     * DelegateHandler tests.
     *
     * @note we don't test the getDelegationSignatureUsingUrl method here, because:
     * - It's a method that uses the network.
     * - It's already tested in the integration tests of transactions-module.
     */
    fixture_1.delegationHandlerFixture.forEach(({ testName, gasPayer, expected }) => {
        (0, globals_1.test)(testName, () => {
            const delegationHandler = (0, src_1.DelegationHandler)(gasPayer);
            (0, globals_1.expect)(delegationHandler.isDelegated()).toBe(expected.isDelegated);
            (0, globals_1.expect)(delegationHandler.gasPayerOrUndefined()).toEqual(expected.gasPayerOrUndefined);
            (0, globals_1.expect)(delegationHandler.gasPayerOrNull()).toEqual(expected.gasPayerOrNull);
        });
    });
    /**
     * Negative tests cases
     */
    (0, globals_1.describe)('Negative tests cases', () => {
        /**
         *Should throw an error when get gasPayerServiceUrl if gasPayer url is not provided.
         */
        (0, globals_1.test)('Should throw an error when get gasPayerServiceUrl if gasPayer url is not provided', async () => {
            await (0, globals_1.expect)(async () => {
                await (0, src_1.DelegationHandler)({
                    gasPayerPrivateKey: '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                }).getDelegationSignatureUsingUrl(sdk_core_1.Transaction.of(Transaction_unit_test_1.TransactionFixture.delegated.body), '0x', src_1.ThorClient.at(src_1.TESTNET_URL).httpClient);
            }).rejects.toThrowError(sdk_errors_1.NotDelegatedTransaction);
        });
    });
});
