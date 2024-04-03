import { Hex0x, Quantity, unitsUtils, ZERO_BUFFER } from '@vechain/sdk-core';
import { TEST_ACCOUNTS_THOR_SOLO } from '../../../fixture';
import { InvalidDataTypeError, ProviderRpcError } from '@vechain/sdk-errors';

/**
 * eth_getBalance RPC call tests - Positive cases
 */
const ethGetBalanceTestCases = [
    {
        description: 'Should return correct balance of the test account',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, 'latest'],
        expected: Quantity.of(unitsUtils.parseVET('500000000'))
    },
    {
        description: 'Should return correct balance of the test account',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, 'best'],
        expected: Quantity.of(unitsUtils.parseVET('500000000'))
    },
    {
        description:
            'Should return correct balance of the test account before seeding',
        params: [
            TEST_ACCOUNTS_THOR_SOLO[0].address,
            Quantity.of(0) // 0 is the genesis block
        ],
        expected: '0x0' // Expected balance is 0
    },
    {
        description:
            'Should return correct balance of the test account after seeding',
        params: [
            // Zero address
            Hex0x.of(ZERO_BUFFER(20)),
            Quantity.of(1)
        ],
        expected: '0x0'
    },
    {
        description: 'Should return error for block number not as hex string',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, '1'], // VechainThor also supports block number as number instead of hex string
        expected: '0x0' // Expected balance is 0
    }
];

/**
 * eth_getBalance RPC call tests - Negative cases
 */
const invalidEthGetBalanceTestCases = [
    {
        description: 'Should throw error for too many params',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, 'latest', 'latest'],
        expectedError: InvalidDataTypeError
    },
    {
        description: 'Should throw error for invalid address',
        params: ['0x123', 'latest'],
        expectedError: ProviderRpcError
    },
    {
        description: 'Should throw error for invalid block number',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, '0x123z'],
        expectedError: ProviderRpcError
    },
    {
        description: 'Should throw error for too few params',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address],
        expectedError: InvalidDataTypeError
    }
];

export { ethGetBalanceTestCases, invalidEthGetBalanceTestCases };
