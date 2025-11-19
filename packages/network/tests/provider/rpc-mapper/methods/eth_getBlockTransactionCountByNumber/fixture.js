"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validTestCases = exports.invalidTestCases = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const validTestCases = [
    {
        description: 'Should return correct transaction count for specific block number',
        blockNumberHex: '0x13F6730',
        expectedTxCount: 1
    }
];
exports.validTestCases = validTestCases;
/**
 * Invalid eth_getBlockTransactionCountByNumber RPC method test cases
 */
const invalidTestCases = [
    {
        description: 'Should throw error when invalid params are provided',
        params: [],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'Should throw an error when first param is not a string',
        params: [0],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'Should throw an error when first param is not a string',
        params: [0, 1],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    }
];
exports.invalidTestCases = invalidTestCases;
