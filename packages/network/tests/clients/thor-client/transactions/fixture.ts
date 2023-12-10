import {
    type TransactionBody,
    TransactionUtils,
    contract,
    unitsUtils,
    networkInfo
} from '@vechainfoundation/vechain-sdk-core';
import { BUILT_IN_CONTRACTS } from '../../../built-in-fixture';
import { TEST_ACCOUNTS } from '../../../fixture';

/**
 * Clause to transfer 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transfer1VTHOClause = {
    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
    value: '0',
    data: contract.coder.encodeFunctionInput(
        BUILT_IN_CONTRACTS.ENERGY_ABI,
        'transfer',
        [
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
            unitsUtils.parseVET('1')
        ]
    )
};

/**
 * Clause to transfer 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transfer1VTHOClauseWithValueAsANumber = {
    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
    value: 0,
    data: contract.coder.encodeFunctionInput(
        BUILT_IN_CONTRACTS.ENERGY_ABI,
        'transfer',
        [
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
            unitsUtils.parseVET('1')
        ]
    )
};

/**
 * transaction body that transfers 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transferTransactionBody: Omit<TransactionBody, 'nonce'> = {
    gas: 5000 + TransactionUtils.intrinsicGas([transfer1VTHOClause]) * 5, // @NOTE it is a temporary gas offered solution. This part will be replaced with estimateGas
    clauses: [transfer1VTHOClause],
    chainTag: networkInfo.solo.chainTag,
    blockRef: networkInfo.solo.genesisBlock.id.slice(0, 18),
    expiration: 1000,
    gasPriceCoef: 128,
    dependsOn: null
};

/**
 * transaction body that transfers 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transferTransactionBodyValueAsNumber: Omit<TransactionBody, 'nonce'> = {
    gas: 5000 + TransactionUtils.intrinsicGas([transfer1VTHOClause]) * 5, // @NOTE it is a temporary gas offered solution. This part will be replaced with estimateGas
    clauses: [transfer1VTHOClauseWithValueAsANumber],
    chainTag: networkInfo.solo.chainTag,
    blockRef: networkInfo.solo.genesisBlock.id.slice(0, 18),
    expiration: 1000,
    gasPriceCoef: 128,
    dependsOn: null
};

/**
 * Expected transaction receipt values.
 * Note that this object is not a valid `TransactionReceipt` object.
 */
const expectedReceipt = {
    events: [],
    gasPayer: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    gasUsed: 36518,
    outputs: [
        {
            contractAddress: null,
            events: [
                {
                    address: '0x0000000000000000000000000000456e65726779',
                    data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
                    topics: [
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x0000000000000000000000002669514f9fe96bc7301177ba774d3da8a06cace4',
                        '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
                    ]
                }
            ],
            transfers: []
        }
    ],
    reverted: false
};

/**
 * waitForTransaction test cases that should return a transaction receipt
 */
const waitForTransactionTestCases = [
    {
        description:
            'Should wait for transaction without timeout and return TransactionReceipt',
        options: {
            timeoutMs: undefined,
            intervalMs: undefined
        }
    },
    {
        description:
            'Should wait for transaction with timeout and return TransactionReceipt',
        options: {
            timeoutMs: 5000,
            intervalMs: undefined
        }
    },
    {
        description:
            'Should wait for transaction with intervalMs TransactionReceipt',
        options: {
            timeoutMs: undefined,
            intervalMs: 100
        }
    },
    {
        description:
            'Should wait for transaction with intervalMs & timeoutMs and return TransactionReceipt',
        options: {
            timeoutMs: 5000,
            intervalMs: 100
        }
    }
];

/**
 * waitForTransaction test cases that should not return a transaction receipt. Instead, should return null.
 */
const invalidWaitForTransactionTestCases = [
    {
        description: 'Should throw error when timeoutMs is too low',
        options: {
            timeoutMs: 1,
            intervalMs: undefined
        }
    }
];

export {
    waitForTransactionTestCases,
    invalidWaitForTransactionTestCases,
    transferTransactionBody,
    transferTransactionBodyValueAsNumber,
    expectedReceipt,
    transfer1VTHOClause
};
