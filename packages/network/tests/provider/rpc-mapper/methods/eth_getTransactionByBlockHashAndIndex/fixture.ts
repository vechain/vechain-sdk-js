import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import {
    validTransactionDetailTestnet,
    validTransactionHashTestnet
} from '../../../fixture';
import { Hex, ZERO_BYTES } from '@vechain/sdk-core';

/**
 * Positive test cases for eth_getTransactionByBlockHashAndIndex
 */
const ethGetTransactionByBlockHashAndIndexTestCases = [
    {
        description: 'eth_getTransactionByBlockHashAndIndex with valid params',
        params: [validTransactionHashTestnet, '0x0'],
        expected: validTransactionDetailTestnet
    },
    {
        description:
            "eth_getTransactionByBlockHashAndIndex with a hash that doesn't exist",
        params: [Hex.of(ZERO_BYTES(32)).toString(), '0x0'],
        expected: null
    }
];

/**
 * Negative test cases for eth_getTransactionByBlockHashAndIndex
 */
const invalidEthGetTransactionByBlockHashAndIndexTestCases = [
    {
        description:
            'eth_getTransactionByBlockHashAndIndex with an invalid hash',
        params: ['0x123', '0x0'],
        expectedError: JSONRPCInternalError
    },
    {
        description:
            'eth_getTransactionByBlockHashAndIndex with an invalid index',
        params: [
            '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
            '0xf'
        ],
        expectedError: JSONRPCInternalError
    },
    {
        description:
            'eth_getTransactionByBlockHashAndIndex with too many params',
        params: ['0x123', '0x123', '0x123'],
        expectedError: JSONRPCInvalidParams
    },
    {
        description:
            'eth_getTransactionByBlockHashAndIndex with too few params',
        params: ['0x123'],
        expectedError: JSONRPCInvalidParams
    },
    {
        description:
            'eth_getTransactionByBlockHashAndIndex with invalid param type',
        params: ['0x123', 123],
        expectedError: JSONRPCInvalidParams
    }
];

export {
    ethGetTransactionByBlockHashAndIndexTestCases,
    invalidEthGetTransactionByBlockHashAndIndexTestCases
};
