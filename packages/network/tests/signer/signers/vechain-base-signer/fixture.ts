import {
    ALL_ACCOUNTS,
    TEST_ACCOUNTS,
    TESTNET_DELEGATE_URL
} from '../../../fixture';
import {
    type SignTransactionOptions,
    type TransactionRequestInput
} from '../../../../src';
import { addressUtils, type TransactionClause } from '@vechain/sdk-core';
import {
    InvalidDataTypeError,
    InvalidSecp256k1PrivateKeyError,
    TransactionDelegationError
} from '@vechain/sdk-errors';

/**
 * SignTransaction test cases
 * Has both correct and incorrect for solo and an example of using delegatorUrl on testnet
 */
const signTransactionTestCases = {
    solo: {
        /**
         * Correct test cases
         */
        correct: [
            {
                description: 'Should sign a transaction without delegation',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
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
                        gas: 57491,
                        gasPriceCoef: 0
                    }
                }
            },
            {
                description:
                    'Should sign a transaction with private key delegation',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    delegatorPrivateKey:
                        TEST_ACCOUNTS.TRANSACTION.DELEGATOR.privateKey
                } satisfies SignTransactionOptions,
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
                        gas: 57491,
                        gasPriceCoef: 0,
                        reserved: {
                            features: 1
                        }
                    }
                }
            }
        ],
        /**
         * Incorrect test cases
         */
        incorrect: [
            {
                description:
                    "Should throw error when delegator's private key is invalid",
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    delegatorPrivateKey: 'INVALID_PRIVATE_KEY'
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expectedError: InvalidSecp256k1PrivateKeyError
            },
            {
                description:
                    "Should throw error when using delegator url on solo network due to no server providing the delegator's signature through an endpoint",
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    delegatorUrl: 'https://example.com'
                } satisfies SignTransactionOptions,
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
                } satisfies SignTransactionOptions,
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
                        gasPriceCoef: 0,
                        reserved: {
                            features: 1
                        }
                    }
                }
            }
        ]
    }
};

/**
 * Account to populate call test cases
 */
const populateCallTestCasesAccount = ALL_ACCOUNTS[0];

/**
 * Test cases for populateCall function
 */
const populateCallTestCases = {
    /**
     * Positive test cases
     */
    positive: [
        // Already defined clauses
        {
            description:
                'Should populate call with clauses already defined BUT empty',
            transactionToPopulate: {
                clauses: []
            } satisfies TransactionRequestInput,
            expected: {
                clauses: [],
                from: addressUtils.toERC55Checksum(
                    populateCallTestCasesAccount.address
                ),
                to: null
            }
        },
        {
            description: 'Should populate call with clauses already defined',
            transactionToPopulate: {
                clauses: [
                    {
                        to: '0x',
                        value: 0,
                        data: '0x'
                    }
                ] as TransactionClause[]
            } satisfies TransactionRequestInput,
            expected: {
                clauses: [
                    {
                        to: '0x',
                        value: 0,
                        data: '0x'
                    }
                ] as TransactionClause[],
                data: '0x',
                from: addressUtils.toERC55Checksum(
                    populateCallTestCasesAccount.address
                ),
                to: '0x',
                value: 0
            }
        },

        // No clauses defined

        // tx.from and tx.to undefined
        {
            description:
                'Should use signer address as from address if not defined AND to address as null if to is not defined',
            transactionToPopulate: {} satisfies TransactionRequestInput,
            expected: {
                from: addressUtils.toERC55Checksum(
                    populateCallTestCasesAccount.address
                ),
                to: null
            } satisfies TransactionRequestInput
        },

        // tx.from defined AND tx.to undefined
        {
            description: 'Should set from address from tx.from',
            transactionToPopulate: {
                from: addressUtils.toERC55Checksum(
                    populateCallTestCasesAccount.address
                )
            } satisfies TransactionRequestInput,
            expected: {
                from: addressUtils.toERC55Checksum(
                    populateCallTestCasesAccount.address
                ),
                to: null
            } satisfies TransactionRequestInput
        },

        // tx.from undefined AND tx.to defined
        {
            description:
                'Should set from address from signer and have tx.to defined',
            transactionToPopulate: {
                to: addressUtils.toERC55Checksum(ALL_ACCOUNTS[1].address)
            } satisfies TransactionRequestInput,
            expected: {
                from: addressUtils.toERC55Checksum(
                    populateCallTestCasesAccount.address
                ),
                to: addressUtils.toERC55Checksum(ALL_ACCOUNTS[1].address)
            } satisfies TransactionRequestInput
        }
    ],

    /**
     * Negative test cases
     */
    negative: [
        // No clauses defined

        // tx.from defined BUT invalid
        {
            description:
                'Should NOT set from address from tx.from because different form signer address',
            transactionToPopulate: {
                from: '0x0000000000000000000000000000000000000000'
            } satisfies TransactionRequestInput,
            expectedError: InvalidDataTypeError
        }
    ]
};

export {
    signTransactionTestCases,
    populateCallTestCasesAccount,
    populateCallTestCases
};
