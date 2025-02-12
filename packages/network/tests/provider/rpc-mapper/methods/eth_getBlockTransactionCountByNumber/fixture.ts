import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

const validTestCases = [
    {
        description:
            'Should return correct transaction count for specific block number',
        blockNumberHex: '0x13F6730',
        expectedTxCount: 1
    }
];

/**
 * Invalid eth_getBlockTransactionCountByNumber RPC method test cases
 */
const invalidTestCases = [
    {
        description: 'Should throw error when invalid params are provided',
        params: [],
        expectedError: JSONRPCInvalidParams
    },
    {
        description: 'Should throw an error when first param is not a string',
        params: [0],
        expectedError: JSONRPCInvalidParams
    },
    {
        description: 'Should throw an error when first param is not a string',
        params: [0, 1],
        expectedError: JSONRPCInvalidParams
    }
];

export { invalidTestCases, validTestCases };
