import { HexInt } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';

/**
 * Positive test cases for eth_getTransactionByBlockNumberAndIndex
 */
const ethGetTransactionByBlockNumberAndIndexTestCases = [
    {
        description: 'eth_getTransactionByBlockHashAndIndex with valid params',
        params: [HexInt.of(17529453).toString(), '0x1'],
        expected: {
            blockHash:
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
            blockNumber: '0x10b7a6d',
            from: '0x7487d912d03ab9de786278f679592b3730bdd540',
            gas: '0xbd30',
            chainId: '0xb127',
            hash: '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
            nonce: '0x176bbcbf79a3a672',
            transactionIndex: '0x1',
            input: '0x799161d500000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
            to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
            value: '0x0',
            gasPrice: '0x0',
            type: '0x0',
            v: '0x0',
            r: '0x0',
            s: '0x0',
            accessList: [],
            maxFeePerGas: '0x0',
            maxPriorityFeePerGas: '0x0',
            yParity: '0x0'
        }
    },
    {
        description:
            "eth_getTransactionByBlockHashAndIndex with a hash that doesn't exist",
        params: [HexInt.of(17529453).toString(), '0x0'],
        expected: {
            accessList: [],
            blockHash:
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
            blockNumber: '0x10b7a6d',
            chainId: '0xb127',
            from: '0x7487d912d03ab9de786278f679592b3730bdd540',
            gas: '0x7436',
            gasPrice: '0x0',
            hash: '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded',
            input: '0xd547741f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84800000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
            maxFeePerGas: '0x0',
            maxPriorityFeePerGas: '0x0',
            nonce: '0xb8314776ce0bf5df',
            r: '0x0',
            s: '0x0',
            to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
            transactionIndex: '0x0',
            type: '0x0',
            v: '0x0',
            value: '0x0',
            yParity: '0x0'
        }
    },
    {
        description: 'eth_getTransactionByBlockHashAndIndex should return null',
        params: [HexInt.of(0).toString(), '0x0'],
        expected: null
    }
];

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
    },
    {
        description: 'Should throw an error when first param is invalid',
        params: [
            '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
            '0x0'
        ],
        expectedError: JSONRPCInternalError
    }
];

export {
    ethGetTransactionByBlockNumberAndIndexTestCases,
    invalidEthGetTransactionByBlockNumberAndIndexTestCases
};
