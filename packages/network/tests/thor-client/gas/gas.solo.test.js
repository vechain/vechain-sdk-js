"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../src");
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const test_utils_1 = require("../../test-utils");
/**
 * Gas module tests.
 *
 * @group integration/clients/thor-client/gas
 */
(0, globals_1.describe)('ThorClient - Gas Module', () => {
    // ThorClient instance
    let thorSoloClient;
    (0, globals_1.beforeEach)(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    /**
     * Test suite for 'estimateGas' method
     */
    (0, globals_1.describe)('estimateGas', () => {
        /**
         * Test cases where the transaction should revert
         */
        fixture_1.estimateGasTestCases.revert.forEach(({ description, clauses, caller, options, expected }) => {
            (0, globals_1.test)(description, async () => {
                const result = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas(clauses, caller, options));
                (0, globals_1.expect)(result).toBeDefined();
                (0, globals_1.expect)(result).toStrictEqual(expected);
            }, 3000);
        });
        /**
         * Test cases where the transaction should succeed
         */
        fixture_1.estimateGasTestCases.success.forEach(({ description, clauses, caller, options, expected }) => {
            (0, globals_1.test)(description, async () => {
                const result = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas(clauses, caller, options));
                (0, globals_1.expect)(result).toBeDefined();
                (0, globals_1.expect)(result).toStrictEqual(expected);
            }, 3000);
        });
        /**
         * Test cases where the gas estimate should throw an error
         */
        fixture_1.invalidEstimateGasTestCases.forEach(({ clauses, options, expectedError }) => {
            (0, globals_1.test)(`Should throw an error with clauses: ${(0, sdk_errors_1.stringifyData)(clauses)}, options: ${(0, sdk_errors_1.stringifyData)(options)}`, async () => {
                await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas(clauses, 
                // Random address
                sdk_core_1.Hex.random(20).toString(), options))).rejects.toThrow(expectedError);
            });
        });
    });
});
