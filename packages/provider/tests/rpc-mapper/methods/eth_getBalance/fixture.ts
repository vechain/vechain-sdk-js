import {
    H0x,
    unitsUtils,
    vechain_sdk_core_ethers,
    ZERO_BUFFER
} from '@vechain/sdk-core';
import { TEST_ACCOUNTS_THOR_SOLO } from '../../../fixture';
import { InvalidDataTypeError, ProviderRpcError } from '@vechain/sdk-errors';

/**
 * eth_getBalance RPC call tests - Positive cases
 */
const ethGetBalanceTestCases = [
    {
        description: 'Should return correct balance of the test account',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, 'latest'],
        expected: vechain_sdk_core_ethers.toQuantity(
            unitsUtils.parseVET('500000000')
        )
    },
    {
        description: 'Should return correct balance of the test account',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, 'best'],
        expected: vechain_sdk_core_ethers.toQuantity(
            unitsUtils.parseVET('500000000')
        )
    },
    {
        description:
            'Should return correct balance of the test account before seeding',
        params: [
            TEST_ACCOUNTS_THOR_SOLO[0].address,
            vechain_sdk_core_ethers.toQuantity(0) // 0 is the genesis block
        ],
        expected: '0x0' // Expected balance is 0
    },
    {
        description:
            'Should return correct balance of the test account after seeding',
        params: [
            // Zero address
            H0x.of(ZERO_BUFFER(20)),
            vechain_sdk_core_ethers.toQuantity(1)
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
    },
    {
        description: 'Should throw error for finalized as block number',
        params: [TEST_ACCOUNTS_THOR_SOLO[0].address, 'finalized'], // VechainThor does not currently support finalized for account details
        expectedError: ProviderRpcError
    }
];

export { ethGetBalanceTestCases, invalidEthGetBalanceTestCases };
