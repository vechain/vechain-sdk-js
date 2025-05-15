import { InvalidDataType, NotDelegatedTransaction } from '@vechain/sdk-errors';
import { type SignTransactionOptions } from '../../../../src';
import {
    TEST_ACCOUNTS,
    TESTNET_DELEGATE_URL,
    configData
} from '../../../fixture';

/**
 * SignTransaction test cases
 * Has both correct and incorrect for solo and an example of using gasPayerServiceUrl on testnet
 */
const signTransactionTestCases = {
    solo: {
        /**
         * Correct test cases
         */
        correct: [
            {
                description:
                    'Should sign a transaction without delegation (legacy)',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                isDelegated: false,
                expected: {
                    body: {
                        chainTag: 246,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: configData.TESTING_CONTRACT_ADDRESS,
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 57175,
                        gasPriceCoef: 0
                    }
                }
            },
            {
                description:
                    'Should sign a transaction without delegation (EIP-1559)',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                isDelegated: false,
                expected: {
                    body: {
                        chainTag: 246,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: configData.TESTING_CONTRACT_ADDRESS,
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 57175
                    }
                }
            },
            {
                description:
                    'Should sign a transaction with private key delegation (legacy)',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    gasPayerPrivateKey:
                        TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.privateKey
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 246,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: configData.TESTING_CONTRACT_ADDRESS,
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 57175,
                        gasPriceCoef: 0,
                        reserved: {
                            features: 1
                        }
                    }
                }
            },
            {
                description:
                    'Should sign a transaction with private key delegation (EIP-1559)',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: {
                    gasPayerPrivateKey:
                        TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.privateKey
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 246,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: configData.TESTING_CONTRACT_ADDRESS,
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 57175,
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
                    "Should throw error when gasPayer's private key is invalid (legacy)",
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    gasPayerPrivateKey: 'INVALID_PRIVATE_KEY'
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expectedError: InvalidDataType
            },
            {
                description:
                    "Should throw error when gasPayer's private key is invalid (EIP-1559)",
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: {
                    gasPayerPrivateKey: 'INVALID_PRIVATE_KEY'
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expectedError: InvalidDataType
            },
            {
                description:
                    "Should throw error when using gasPayer url on solo network due to no server providing the gasPayer's signature through an endpoint (legacy)",
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    gasPayerServiceUrl: 'https://example.com'
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expectedError: NotDelegatedTransaction
            },
            {
                description:
                    "Should throw error when using gasPayer url on solo network due to no server providing the gasPayer's signature through an endpoint (EIP-1559)",
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: {
                    gasPayerServiceUrl: 'https://example.com'
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expectedError: NotDelegatedTransaction
            }
        ]
    },
    testnet: {
        correct: [
            {
                description:
                    'Should sign a transaction with delegation url (legacy)',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    gasPayerServiceUrl: TESTNET_DELEGATE_URL
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 39,
                        clauses: [
                            {
                                data: '0x01cb08c5000000000000000000000000000000000000000000000000000000000000007b',
                                to: configData.TESTING_CONTRACT_ADDRESS,
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
            },
            {
                description:
                    'Should sign a transaction with delegation url (EIP-1559)',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: {
                    gasPayerServiceUrl: TESTNET_DELEGATE_URL
                } satisfies SignTransactionOptions,
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 39,
                        clauses: [
                            {
                                data: '0x01cb08c5000000000000000000000000000000000000000000000000000000000000007b',
                                to: configData.TESTING_CONTRACT_ADDRESS,
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 21464,
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
                    'Should NOT sign a transaction with delegation when no gasPayer is provided (legacy)',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: undefined,
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
                },
                expectedError: NotDelegatedTransaction
            },
            {
                description:
                    'Should NOT sign a transaction with delegation when no gasPayer is provided (EIP-1559)',
                origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: undefined,
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
                        reserved: {
                            features: 1
                        }
                    }
                },
                expectedError: NotDelegatedTransaction
            }
        ]
    }
};

export { signTransactionTestCases };
