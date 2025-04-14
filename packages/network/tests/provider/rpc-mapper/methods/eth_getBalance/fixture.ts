import { Hex, Quantity, ZERO_BYTES, Units } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import { THOR_SOLO_SEEDED_VET_AMOUNT } from '@vechain/sdk-solo-setup';
import { getUnusedAccount } from '../../../../fixture';

const account = getUnusedAccount();

/**
 * eth_getBalance RPC call tests - Positive cases
 */
const ethGetBalanceTestCases = [
    {
        description: 'Should return correct balance of the test account',
        params: [account.address, 'latest'],
        expected: Quantity.of(
            Units.parseEther(THOR_SOLO_SEEDED_VET_AMOUNT.toString()).bi
        ).toString()
    },
    {
        description:
            'Should return correct balance of the test account before seeding',
        params: [
            account.address,
            Quantity.of(0).toString() // 0 is the genesis block
        ],
        expected: '0x0' // Expected balance is 0
    },
    {
        description:
            'Should return correct balance of the test account after seeding',
        params: [
            // Zero address
            Hex.of(ZERO_BYTES(20)).toString(),
            Quantity.of(1).toString()
        ],
        expected: '0x0'
    },
    {
        description: 'Should return error for block number not as hex string',
        params: [account.address, '1'], // VeChainThor also supports block number as number instead of hex string
        expected: '0x0' // Expected balance is 0
    }
];

/**
 * eth_getBalance RPC call tests - Negative cases
 */
const invalidEthGetBalanceTestCases = [
    {
        description: 'Should throw error for too many params',
        params: [account.address, 'latest', 'latest'],
        expectedError: JSONRPCInvalidParams
    },
    {
        description: 'Should throw error for invalid address',
        params: ['0x-123', 'latest'],
        expectedError: JSONRPCInternalError
    },
    {
        description: 'Should throw error for invalid block number',
        params: [account.address, '0x123z'],
        expectedError: JSONRPCInternalError
    },
    {
        description: 'Should throw error for too few params',
        params: [account.address],
        expectedError: JSONRPCInvalidParams
    }
];

export { ethGetBalanceTestCases, invalidEthGetBalanceTestCases };
