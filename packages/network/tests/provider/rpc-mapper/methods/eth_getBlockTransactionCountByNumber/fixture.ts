import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * Invalid eth_getBlockByHash RPC method test cases
 */
const invalideEthGetBlockTransactionCountByHashTestCases = [
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

export { invalideEthGetBlockTransactionCountByHashTestCases };
