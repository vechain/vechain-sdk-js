import {
    type TransactionBody,
    TransactionUtils,
    contract,
    unitsUtils,
    networkInfo
} from '@vechainfoundation/vechain-sdk-core';
import { BUILT_IN_CONTRACTS } from '../../built-in-fixture';
import {
    TESTING_CONTRACT_ABI,
    TESTNET_DELEGATE_URL,
    TEST_ACCOUNTS,
    TEST_CONTRACT_ADDRESS
} from '../../fixture';
import {
    InvalidSecp256k1PrivateKeyError,
    TransactionDelegationError
} from '@vechainfoundation/vechain-sdk-errors';

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

/**
 * buildTransactionBody test cases
 */
const buildTransactionBodyClausesTestCases = [
    {
        description: 'Should build transaction body that transfers 1 VTHO',
        clauses: [transfer1VTHOClause],
        options: {},
        expected: {
            solo: {
                chainTag: 246,
                clauses: [
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    }
                ],
                dependsOn: null,
                expiration: 32,
                gas: 36518,
                gasPriceCoef: 127,
                reserved: undefined
            },
            testnet: {
                chainTag: 39,
                clauses: [
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    }
                ],
                dependsOn: null,
                expiration: 32,
                gas: 24263,
                gasPriceCoef: 127,
                reserved: undefined
            }
        }
    },
    {
        description:
            'Should build transaction that executes many clauses and all options',
        clauses: [
            transfer1VTHOClause,
            transfer1VTHOClause,
            {
                to: TEST_CONTRACT_ADDRESS,
                value: '0',
                data: contract.coder.encodeFunctionInput(
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
            gasPriceCoef: 255,
            expiration: 1000,
            isDelegated: true,
            dependsOn:
                '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f' // Any valid tx id
        },
        expected: {
            solo: {
                chainTag: 246,
                clauses: [
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    },
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    },
                    {
                        data: '0xc7bce69d0000000000000000000000000000000000000000000000000000000000000000',
                        to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                        value: '0'
                    },
                    {
                        data: '0x',
                        to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
                        value: '1000000000000000000'
                    }
                ],
                dependsOn:
                    '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f',
                expiration: 1000,
                gas: 100954,
                gasPriceCoef: 255,
                reserved: { features: 1 }
            },
            testnet: {
                chainTag: 39,
                clauses: [
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    },
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    },
                    {
                        data: '0xc7bce69d0000000000000000000000000000000000000000000000000000000000000000',
                        to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                        value: '0'
                    },
                    {
                        data: '0x',
                        to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
                        value: '1000000000000000000'
                    }
                ],
                dependsOn:
                    '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f',
                expiration: 1000,
                gas: 74855,
                gasPriceCoef: 255,
                reserved: { features: 1 }
            }
        }
    }
];

/**
 * signTransaction test cases
 * Has both correct and incorrect for solo and an example of using delegatorUrl on testnet
 */
const signTransactionTestCases = {
    solo: {
        correct: [
            {
                description: 'Should sign a transaction without delegation',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {},
                isDelegated: false,
                expected: {
                    body: {
                        chainTag: 246,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 42491,
                        gasPriceCoef: 127,
                        reserved: undefined
                    }
                }
            },
            {
                description:
                    'Should sign a transaction with private key delegation',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    delegatorPrivatekey:
                        TEST_ACCOUNTS.TRANSACTION.DELEGATOR.privateKey
                },
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 246,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 42491,
                        gasPriceCoef: 127,
                        reserved: {
                            features: 1
                        }
                    }
                }
            }
        ],
        incorrect: [
            {
                description:
                    "Should throw error when delegator's private key is invalid",
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    delegatorPrivatekey: '0x'
                },
                isDelegated: true,
                expectedError: InvalidSecp256k1PrivateKeyError
            },
            {
                description:
                    'Should throw error when delegator private key is invalid',
                origin: {
                    privateKey: '0x'
                },
                options: {},
                isDelegated: true,
                expectedError: InvalidSecp256k1PrivateKeyError
            },
            {
                description:
                    "Should throw error when using delegator url on solo network due to no server providing the delegator's signature through an endpoint",
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    delegatorUrl: 'https://example.com'
                },
                isDelegated: true,
                expectedError: TransactionDelegationError
            }
        ]
    },
    testnet: {
        correct: [
            {
                description: 'Should sign a transaction with delegation url',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    delegatorUrl: TESTNET_DELEGATE_URL
                },
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 39,
                        clauses: [
                            {
                                data: '0x01cb08c5000000000000000000000000000000000000000000000000000000000000007b',
                                to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 21464,
                        gasPriceCoef: 127,
                        reserved: {
                            features: 1
                        }
                    }
                }
            }
        ]
    }
};

export {
    waitForTransactionTestCases,
    invalidWaitForTransactionTestCases,
    transferTransactionBody,
    transferTransactionBodyValueAsNumber,
    expectedReceipt,
    transfer1VTHOClause,
    buildTransactionBodyClausesTestCases,
    signTransactionTestCases
};
