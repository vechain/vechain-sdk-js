import { ZERO_BUFFER, dataUtils } from '@vechain/vechain-sdk-core';
import {
    InvalidDataTypeError,
    ProviderRpcError
} from '../../../../../errors/dist';

/**
 * Positive test cases for eth_getTransactionByHash
 */
const ethGetTransactionByHashTestCases = [
    {
        description: 'eth_getTransactionByHash with a valid hash',
        params: [
            '0xb2e3f6e9782f462d797b72f9cbf5a4c38ca20cabcc1a091f9de6d3e6736c1f7c'
        ],
        expected: {
            blockHash:
                '0x010b7b5f0192003f70bf2a6a502221e075cb32d676e3443614d21003cc2ee440',
            blockNumber: '0x10b7b5f',
            from: '0x8c59c63d6458c71b6ff88d57698437524a703084',
            gas: '0x618af',
            chainId:
                '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            hash: '0xb2e3f6e9782f462d797b72f9cbf5a4c38ca20cabcc1a091f9de6d3e6736c1f7c',
            nonce: '0x19b4782',
            transactionIndex: '0x0',
            input: '0xf14fcbc8ad2a4a05c94893cc69b721955da2fb2e93ba001224f6ec7250ad110765065541',
            to: '0xaeb29614bb9af450a7fff539bbba319455a1aca7',
            value: '0x0',
            gasPrice: '0x',
            type: '0x',
            v: '0x',
            r: '0x',
            s: '0x',
            accessList: [],
            maxFeePerGas: '0x',
            maxPriorityFeePerGas: '0x',
            yParity: '0x'
        }
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
    }
];

export {
    ethGetTransactionByHashTestCases,
    invalidEthGetTransactionByHashTestCases
};
