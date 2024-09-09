import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

const invalidEthGetTransactionByBlockNumberAndIndexTestCases = [
    {
        description: 'Should throw an error when there are too many params',
        params: ['0x0', '0x0', 'Extra param'],
        expectedError: JSONRPCInvalidParams
    },
    {
        description: 'Should throw an error when first param is not a string',
        params: [0, '0x0'],
        expectedError: JSONRPCInvalidParams
    },
    {
        description: 'Should throw an error when second param is not a strin',
        params: ['0x0', 0],
        expectedError: JSONRPCInvalidParams
    }
];

export { invalidEthGetTransactionByBlockNumberAndIndexTestCases };
