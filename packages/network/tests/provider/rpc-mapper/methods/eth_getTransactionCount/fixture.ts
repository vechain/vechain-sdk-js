import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * Negative test cases for eth_getTransactionCount
 */
const invalidEthGetTransactionCountTestCases = [
    {
        description: 'eth_getTransactionCount - Missing params',
        params: [],
        expectedError: JSONRPCInvalidParams
    },
    {
        description:
            'eth_getTransactionCount - Invalid address param AND params number',
        params: ['0xINVALID_ADDRESS'],
        expectedError: JSONRPCInvalidParams
    },
    {
        description: 'eth_getTransactionCount - Invalid address format',
        params: ['0xINVALID_ADDDRESS', 'latest'],
        expectedError: JSONRPCInvalidParams
    }
];

export { invalidEthGetTransactionCountTestCases };
