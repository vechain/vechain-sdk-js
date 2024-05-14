import { Quantity } from '@vechain/sdk-core';
import { blockWithTransactionsExpanded } from '../../../fixture';
import { InvalidDataTypeError } from '@vechain/sdk-errors';

/**
 * Zero block fixture
 */
const zeroBlock = {
    hash: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
    parentHash:
        '0xffffffff00000000000000000000000000000000000000000000000000000000',
    number: '0x0',
    size: '0xaa',
    stateRoot:
        '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
    receiptsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    transactionsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    timestamp: '0x5b322ac0',
    gasLimit: '0x989680',
    gasUsed: '0x0',
    transactions: [],
    miner: '0x0000000000000000000000000000000000000000',
    difficulty: '0x0',
    totalDifficulty: '0x0',
    uncles: [],
    sha3Uncles:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    nonce: '0x0000000000000000',
    logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    extraData: '0x',
    baseFeePerGas: '0x0',
    mixHash:
        '0x0000000000000000000000000000000000000000000000000000000000000000'
};

/**
 * Test cases for eth_getBlockByNumber RPC method
 */
const ethGetBlockByNumberTestCases = [
    {
        description: "Should get block by number '0x0'",
        params: [Quantity.of(0), false],
        expected: zeroBlock
    },
    {
        description:
            "Should get block by number '0x0' with transaction details",
        params: [Quantity.of(0), true],
        expected: zeroBlock // Because genesis block doesn't have any transactions on testnet
    },
    {
        description: 'Should get block which has transactions with details',
        params: [Quantity.of(17529453), true],
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
 * Invalid eth_getBlockByNumber RPC method test cases
 */
const invalidEthGetBlockByNumberTestCases = [
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
    }
];

export {
    zeroBlock,
    ethGetBlockByNumberTestCases,
    invalidEthGetBlockByNumberTestCases
};
