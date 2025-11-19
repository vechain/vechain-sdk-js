"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidEthGetBalanceTestCases = exports.ethGetBalanceTestCases = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
const fixture_1 = require("../../../../fixture");
const account = fixture_1.TEST_ACCOUNTS.ACCOUNT.NOT_MUTATED_BALANCE_ACCOUNT;
/**
 * eth_getBalance RPC call tests - Positive cases
 */
const ethGetBalanceTestCases = [
    {
        description: 'Should return correct balance of the test account',
        params: [account.address, 'latest'],
        expected: sdk_core_1.Quantity.of(sdk_core_1.Units.parseEther(sdk_solo_setup_1.THOR_SOLO_SEEDED_VET_AMOUNT.toString()).bi).toString()
    },
    {
        description: 'Should return correct balance of the test account before seeding',
        params: [
            account.address,
            sdk_core_1.Quantity.of(0).toString() // 0 is the genesis block
        ],
        expected: '0x0' // Expected balance is 0
    },
    {
        description: 'Should return correct balance of the test account after seeding',
        params: [
            // Zero address
            sdk_core_1.Hex.of((0, sdk_core_1.ZERO_BYTES)(20)).toString(),
            sdk_core_1.Quantity.of(1).toString()
        ],
        expected: '0x0'
    },
    {
        description: 'Should return error for block number not as hex string',
        params: [account.address, '1'], // VeChainThor also supports block number as number instead of hex string
        expected: '0x0' // Expected balance is 0
    }
];
exports.ethGetBalanceTestCases = ethGetBalanceTestCases;
/**
 * eth_getBalance RPC call tests - Negative cases
 */
const invalidEthGetBalanceTestCases = [
    {
        description: 'Should throw error for too many params',
        params: [account.address, 'latest', 'latest'],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        description: 'Should throw error for invalid address',
        params: ['0x-123', 'latest'],
        expectedError: sdk_errors_1.JSONRPCInternalError
    },
    {
        description: 'Should throw error for invalid block number',
        params: [account.address, '0x123z'],
        expectedError: sdk_errors_1.JSONRPCInternalError
    },
    {
        description: 'Should throw error for too few params',
        params: [account.address],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    }
];
exports.invalidEthGetBalanceTestCases = invalidEthGetBalanceTestCases;
