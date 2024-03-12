import { blockWithTransactionsExpanded } from '../../../fixture';

import { zeroBlock } from '../eth_getBlockByNumber/fixture';
import { InvalidDataTypeError } from '@vechain/sdk-errors';

/**
 * Test cases for eth_getBlockByHash RPC method
 */
const ethGetBlockByHashTestCases = [
    {
        description: 'Should get block zero block',
        params: [
            '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            false
        ],
        expected: zeroBlock
    },
    {
        description: 'Should get block zero block with transaction details',
        params: [
            '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            true
        ],
        expected: zeroBlock // Because genesis block doesn't have any transactions on testnet
    },
    {
        description: 'Should get block which has transactions with details',
        params: [
            '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
            true
        ],
        expected: blockWithTransactionsExpanded
    },
    {
        description:
            'Should return null for no block found with given revision',
        params: [
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            false
        ],
        expected: null
    }
];

/**
 * Invalid eth_getBlockByHash RPC method test cases
 */
const invalidEthGetBlockByHashTestCases = [
    {
        description: 'Should throw an error when there are too many params',
        params: ['0x0', false, "I'm an extra param"],
        expectedError: InvalidDataTypeError
    },
    {
        description: 'Should throw an error when first param is not a string',
        params: [0, false],
        expectedError: InvalidDataTypeError
    },
    {
        description: 'Should throw an error when second param is not a boolean',
        params: ['0x0', 'false'],
        expectedError: InvalidDataTypeError
    },
    {
        description:
            'Should throw an error when we use getBlockByNumber parameters for block number',
        params: ['latest', false],
        expectedError: InvalidDataTypeError
    }
];

export { ethGetBlockByHashTestCases, invalidEthGetBlockByHashTestCases };
