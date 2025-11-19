"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidEthGetTransactionCountTestCases = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Negative test cases for eth_getTransactionCount
 */
const invalidEthGetTransactionCountTestCases = [
    {
        description: 'eth_getTransactionCount - Missing params',
        params: [],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'eth_getTransactionCount - Invalid address param AND params number',
        params: ['0xINVALID_ADDRESS'],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'eth_getTransactionCount - Invalid address format',
        params: ['0xINVALID_ADDDRESS', 'latest'],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    }
];
exports.invalidEthGetTransactionCountTestCases = invalidEthGetTransactionCountTestCases;
