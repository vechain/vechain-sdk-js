import { ZERO_BUFFER, dataUtils } from '@vechain/vechain-sdk-core';
import {
    validTransactionDetailTestnet,
    validTransactionHashTestnet
} from '../../../fixture';
import {
    InvalidDataTypeError,
    ProviderRpcError
} from '@vechain/vechain-sdk-errors';

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
        params: [
            dataUtils.toHexString(ZERO_BUFFER(32), {
                withPrefix: true
            })
        ],
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
        expectedError: ProviderRpcError
    },
    {
        description: 'eth_getTransactionByHash with too many params',
        params: ['0x123', '0x123'],
        expectedError: InvalidDataTypeError
    },
    {
        description: 'eth_getTransactionByHash with too few params',
        params: [],
        expectedError: InvalidDataTypeError
    },
    {
        description: 'eth_getTransactionByHash with invalid param type',
        params: [123],
        expectedError: InvalidDataTypeError
    }
];

export {
    ethGetTransactionByHashTestCases,
    invalidEthGetTransactionByHashTestCases
};
