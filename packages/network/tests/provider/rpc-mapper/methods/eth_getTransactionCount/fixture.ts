import { InvalidDataTypeError } from '@vechain/sdk-errors';

/**
 * Negative test cases for eth_getTransactionCount
 */
const invalidEthGetTransactionCountTestCases = [
    {
        description: 'eth_getTransactionCount - Missing params',
        params: [],
        expectedError: InvalidDataTypeError
    },
    {
        description: 'eth_getTransactionCount - Invalid address param',
        params: ['0xINVALID_ADDRESS'],
        expectedError: InvalidDataTypeError
    }
];

export { invalidEthGetTransactionCountTestCases };
