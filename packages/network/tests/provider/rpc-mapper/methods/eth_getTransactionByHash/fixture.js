"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidEthGetTransactionByHashTestCases = exports.ethGetTransactionByHashTestCases = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const fixture_1 = require("../../../fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Positive test cases for eth_getTransactionByHash
 */
const ethGetTransactionByHashTestCases = [
    {
        description: 'eth_getTransactionByHash with a valid hash',
        params: [fixture_1.validTransactionHashTestnet],
        expected: fixture_1.validTransactionDetailTestnet
    },
    {
        description: "eth_getTransactionByHash with a hash that doesn't exist",
        params: [sdk_core_1.Hex.of((0, sdk_core_1.ZERO_BYTES)(32)).toString()],
        expected: null
    }
];
exports.ethGetTransactionByHashTestCases = ethGetTransactionByHashTestCases;
/**
 * Negative test cases for eth_getTransactionByHash
 */
const invalidEthGetTransactionByHashTestCases = [
    {
        description: 'eth_getTransactionByHash with an invalid hash',
        params: ['0x123'],
        expectedError: sdk_errors_1.JSONRPCInternalError
    },
    {
        description: 'eth_getTransactionByHash with too many params',
        params: ['0x123', '0x123'],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'eth_getTransactionByHash with too few params',
        params: [],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'eth_getTransactionByHash with invalid param type',
        params: [123],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    }
];
exports.invalidEthGetTransactionByHashTestCases = invalidEthGetTransactionByHashTestCases;
