"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidEthGetStorageAtTestCases = exports.ethGetStorageAtTestCases = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Test cases for eth_getStorageAt RPC method
 */
const ethGetStorageAtTestCases = [
    {
        description: 'Should return storage slot value for a given smart contract that has a storage slot value different than NULL',
        params: [
            '0x93Ae8aab337E58A6978E166f8132F59652cA6C56',
            '0x1',
            '0x10afdf1' // Block n. 17497585
        ],
        expected: '0x0000000000000000000000000000000000000000000000000000000061474260'
    },
    {
        description: 'Should return storage slot value for a given smart contract that has a storage slot value different than NULL',
        params: [
            '0x93Ae8aab337E58A6978E166f8132F59652cA6C56',
            '0x0000000000000000000000000000000000000000000000000000000000000001',
            '0x10afdf1' // Block n. 17497585
        ],
        expected: '0x0000000000000000000000000000000000000000000000000000000061474260'
    },
    {
        description: 'Should return null slot value for an address that does not have a storage slot value at the given position',
        params: [
            sdk_core_1.Hex.of((0, sdk_core_1.ZERO_BYTES)(20)).toString(),
            '0x1',
            'latest' // Block n. 17497585
        ],
        expected: '0x0000000000000000000000000000000000000000000000000000000000000000'
    }
];
exports.ethGetStorageAtTestCases = ethGetStorageAtTestCases;
/**
 * Test cases for eth_getStorageAt RPC method that throw an error
 */
const invalidEthGetStorageAtTestCases = [
    {
        description: 'Should throw error for too many params',
        params: [
            '0x93Ae8aab337E58A6978E166f8132F59652cA6C56', // Contract with non-null storage slot at position 1
            '0x1',
            '0x10afdf1',
            '0x10afdf1'
        ],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'Should throw error for too few params',
        params: ['0x93Ae8aab337E58A6978E166f8132F59652cA6C56', '0x1'],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'Should throw error for invalid address',
        params: ['0x-123', '0x1', '0x10afdf1'],
        expectedError: sdk_errors_1.JSONRPCInternalError
    },
    {
        description: 'Should throw error for invalid slot',
        params: ['0x-123', `0x${'0'.repeat(65)}1`, '0x10afdf1'],
        expectedError: sdk_errors_1.JSONRPCInternalError
    }
];
exports.invalidEthGetStorageAtTestCases = invalidEthGetStorageAtTestCases;
