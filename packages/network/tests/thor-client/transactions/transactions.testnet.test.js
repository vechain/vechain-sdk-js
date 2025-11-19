"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const fixture_2 = require("../../fixture");
const src_1 = require("../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Transactions module tests suite.
 *
 * @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('Transactions module Testnet tests suite', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        provider = new src_1.VeChainProvider(thorClient, (0, fixture_2.getUnusedBaseWallet)(), false);
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        provider.destroy();
    });
    /**
     * Test suite for buildTransactionBody method
     */
    (0, globals_1.describe)('buildTransactionBody', () => {
        /**
         * buildTransactionBody test cases with different options
         */
        fixture_1.buildTransactionBodyClausesTestCases.forEach(({ description, clauses, options, expected }) => {
            (0, globals_1.test)(description, async () => {
                const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
                const gasResult = await thorClient.transactions.estimateGas(clauses, '0x000000000000000000000000004d000000000000' // This address might not exist on testnet, thus the gasResult.reverted might be true
                );
                (0, globals_1.expect)(gasResult.totalGas).toBe(expected.testnet.gas);
                const txBody = await thorClient.transactions.buildTransactionBody(clauses, gasResult.totalGas, options);
                (0, globals_1.expect)(txBody).toBeDefined();
                (0, globals_1.expect)(txBody.clauses).toStrictEqual(expected.testnet.clauses);
                (0, globals_1.expect)(txBody.expiration).toBe(expected.testnet.expiration);
                (0, globals_1.expect)(txBody.gas).toBe(gasResult.totalGas);
                (0, globals_1.expect)(txBody.dependsOn).toBe(expected.testnet.dependsOn);
                (0, globals_1.expect)(txBody.gasPriceCoef).toBe(expected.testnet.gasPriceCoef);
                (0, globals_1.expect)(txBody.reserved).toStrictEqual(expected.testnet.reserved);
                (0, globals_1.expect)(txBody.chainTag).toBe(expected.testnet.chainTag);
            }, 8000);
        });
    });
    /**
     * Test suite for getRevertReason method
     */
    (0, globals_1.describe)('getRevertReason', () => {
        /**
         * Get revert info test case
         */
        fixture_1.getRevertReasonTestCasesFixture.forEach((testCase) => {
            (0, globals_1.test)(testCase.description, async () => {
                const revertReason = await thorClient.transactions.getRevertReason(testCase.revertedTransactionHash, testCase.errorFragment);
                (0, globals_1.expect)(revertReason).toStrictEqual(testCase.expected);
            });
        }, 10000);
    });
    /**
     * Test negative cases
     */
    (0, globals_1.describe)('Negative cases', () => {
        /**
         * waitForTransaction() with invalid transaction id
         */
        (0, globals_1.test)('waitForTransaction with invalid transaction id', async () => {
            await (0, globals_1.expect)(async () => {
                await thorClient.transactions.waitForTransaction('0xINVALID');
            }).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
        /**
         * getTransactionRaw() with invalid input data
         */
        (0, globals_1.test)('getTransactionRaw with invalid input data', async () => {
            // Invalid transaction id
            await (0, globals_1.expect)(async () => {
                await thorClient.transactions.getTransactionRaw('0xINVALID');
            }).rejects.toThrow(sdk_errors_1.InvalidDataType);
            // Invalid block id
            await (0, globals_1.expect)(async () => {
                await thorClient.transactions.getTransactionRaw(fixture_1.getRevertReasonTestCasesFixture[0].revertedTransactionHash, { head: '0xINVALID' });
            }).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
    });
});
