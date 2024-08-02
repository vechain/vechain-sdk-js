import { _Hex0x, ZERO_BYTES } from '@vechain/sdk-core';
import {
    validTransactionDetailTestnet,
    validTransactionHashTestnet
} from '../../../fixture';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';

/**
 * Positive test cases for eth_getTransactionByHash
 */
const ethGetTransactionByHashTestCases = [
    {
        description: 'eth_getTransactionByHash with a valid hash',
        params: [validTransactionHashTestnet],
        expected: validTransactionDetailTestnet
    },
    {
        description: "eth_getTransactionByHash with a hash that doesn't exist",
        params: [_Hex0x.of(ZERO_BYTES(32))],
        expected: null
    }
];

/**
 * Negative test cases for eth_getTransactionByHash
 */
const invalidEthGetTransactionByHashTestCases = [
    {
        description: 'eth_getTransactionByHash with an invalid hash',
        params: ['0x123'],
        expectedError: JSONRPCInternalError
    },
    {
        description: 'eth_getTransactionByHash with too many params',
        params: ['0x123', '0x123'],
        expectedError: JSONRPCInvalidParams
    },
    {
        description: 'eth_getTransactionByHash with too few params',
        params: [],
        expectedError: JSONRPCInvalidParams
    },
    {
        description: 'eth_getTransactionByHash with invalid param type',
        params: [123],
        expectedError: JSONRPCInvalidParams
    }
];

export {
    ethGetTransactionByHashTestCases,
    invalidEthGetTransactionByHashTestCases
};
