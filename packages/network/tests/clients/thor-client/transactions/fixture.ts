import {
    type TransactionBody,
    TransactionUtils,
    contract,
    unitsUtils,
    networkInfo
} from '@vechainfoundation/vechain-sdk-core';
import { BUILT_IN_CONTRACTS } from '../../../built-in-fixture';
import {
    TESTING_CONTRACT_ABI,
    TEST_ACCOUNTS,
    TEST_CONTRACT_ADDRESS
} from '../../../fixture';

/**
 * Clause to transfer 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transfer1VTHOClause = {
    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
    value: '0',
    data: contract.encodeFunctionInput(
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

const estimateGasTestCases = {
    revert: [
        {
            description:
                'Should estimate gas cost of a transaction that reverts with 1 clause',
            clauses: [
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: contract.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1000000000')
                        ]
                    )
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['builtin: insufficient balance'],
                reverted: true,
                totalGas: 24455,
                vmErrors: ['execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with 2 clauses where both revert',
            clauses: [
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: contract.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1000000000')
                        ]
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1000000000').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['builtin: insufficient balance'],
                reverted: true,
                totalGas: 40455,
                vmErrors: ['execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with 2 clauses where only second reverts',
            clauses: [
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: contract.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1')
                        ]
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1000000000').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['', ''],
                reverted: true,
                totalGas: 52518,
                vmErrors: ['', 'insufficient balance for transfer']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with 3 clauses where only last reverts',
            clauses: [
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: contract.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1')
                        ]
                    )
                },
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: contract.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1')
                        ]
                    )
                },
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: contract.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1000000000')
                        ]
                    )
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['', '', 'builtin: insufficient balance'],
                reverted: true,
                totalGas: 87491,
                vmErrors: ['', '', 'execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with a Panic(uint256) error',
            clauses: [
                {
                    to: TEST_CONTRACT_ADDRESS,
                    value: '0',
                    data: contract.encodeFunctionInput(
                        TESTING_CONTRACT_ABI,
                        'testAssertError',
                        [1] // Any number !== 0 will cause Panic error
                    )
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: [1n], // 0x01: If you call assert with an argument that evaluates to false.
                reverted: true,
                totalGas: 22009,
                vmErrors: ['execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts due to offered gas below the gas required',
            clauses: [transfer1VTHOClause],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
                gas: 1000
            },
            expected: {
                reverted: true,
                totalGas: 24192,
                revertReasons: [''],
                vmErrors: ['out of gas']
            }
        }
    ],
    success: [
        {
            description:
                'Should estimate gas cost of a transaction that transfers 1 VTHO',
            clauses: [transfer1VTHOClause],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                reverted: false,
                totalGas: 36518,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that executes many clauses',
            clauses: [
                transfer1VTHOClause,
                transfer1VTHOClause,
                {
                    to: TEST_CONTRACT_ADDRESS,
                    value: '0',
                    data: contract.encodeFunctionInput(
                        TESTING_CONTRACT_ABI,
                        'testAssertError',
                        [0] // Any number !== 0 will cause Panic error
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                reverted: false,
                totalGas: 100954,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction with delegation context',
            clauses: [transfer1VTHOClause],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
                gasPayer: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
            },
            expected: {
                reverted: false,
                totalGas: 36518,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction sending VET',
            clauses: [
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                reverted: false,
                totalGas: 21000,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction sending VET with 2 clauses',
            clauses: [
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1').toString(),
                    data: '0x'
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                reverted: false,
                totalGas: 37000,
                revertReasons: [],
                vmErrors: []
            }
        }
    ]
};

export {
    waitForTransactionTestCases,
    invalidWaitForTransactionTestCases,
    transferTransactionBody,
    expectedReceipt,
    estimateGasTestCases
};
