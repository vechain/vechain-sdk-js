"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTransactionTestCases = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const fixture_1 = require("../../../fixture");
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
                description: 'Should sign a transaction without delegation (legacy)',
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    gasPriceCoef: 0
                },
                isDelegated: false,
                expected: {
                    body: {
                        chainTag: fixture_1.configData.SOLO_CHAIN_TAG,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: fixture_1.configData.TESTING_CONTRACT_ADDRESS,
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
                description: 'Should sign a transaction without delegation (EIP-1559)',
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                isDelegated: false,
                expected: {
                    body: {
                        chainTag: fixture_1.configData.SOLO_CHAIN_TAG,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: fixture_1.configData.TESTING_CONTRACT_ADDRESS,
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
                description: 'Should sign a transaction with private key delegation (legacy)',
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    gasPriceCoef: 0
                },
                options: {
                    gasPayerPrivateKey: fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.privateKey
                },
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: fixture_1.configData.SOLO_CHAIN_TAG,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: fixture_1.configData.TESTING_CONTRACT_ADDRESS,
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
                description: 'Should sign a transaction with private key delegation (EIP-1559)',
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: {
                    gasPayerPrivateKey: fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.privateKey
                },
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: fixture_1.configData.SOLO_CHAIN_TAG,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: fixture_1.configData.TESTING_CONTRACT_ADDRESS,
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
                description: "Should throw error when gasPayer's private key is invalid (legacy)",
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    gasPayerPrivateKey: 'INVALID_PRIVATE_KEY'
                },
                isDelegated: true,
                expectedError: sdk_errors_1.InvalidDataType
            },
            {
                description: "Should throw error when gasPayer's private key is invalid (EIP-1559)",
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: {
                    gasPayerPrivateKey: 'INVALID_PRIVATE_KEY'
                },
                isDelegated: true,
                expectedError: sdk_errors_1.InvalidDataType
            },
            {
                description: "Should throw error when using gasPayer url on solo network due to no server providing the gasPayer's signature through an endpoint (legacy)",
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                options: {
                    gasPayerServiceUrl: 'https://example.com'
                },
                isDelegated: true,
                expectedError: sdk_errors_1.NotDelegatedTransaction
            },
            {
                description: "Should throw error when using gasPayer url on solo network due to no server providing the gasPayer's signature through an endpoint (EIP-1559)",
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: {
                    gasPayerServiceUrl: 'https://example.com'
                },
                isDelegated: true,
                expectedError: sdk_errors_1.NotDelegatedTransaction
            }
        ]
    },
    testnet: {
        correct: [
            {
                description: 'Should sign a transaction with delegation url (legacy)',
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    gasPriceCoef: 0
                },
                options: {
                    gasPayerServiceUrl: fixture_1.TESTNET_DELEGATE_URL
                },
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 39,
                        clauses: [
                            {
                                data: '0x01cb08c5000000000000000000000000000000000000000000000000000000000000007b',
                                to: fixture_1.configData.TESTING_CONTRACT_ADDRESS,
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
                description: 'Should sign a transaction with delegation url (EIP-1559)',
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
                params: {
                    maxPriorityFeePerGas: '0x1000',
                    maxFeePerGas: '0x2000'
                },
                options: {
                    gasPayerServiceUrl: fixture_1.TESTNET_DELEGATE_URL
                },
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 39,
                        clauses: [
                            {
                                data: '0x01cb08c5000000000000000000000000000000000000000000000000000000000000007b',
                                to: fixture_1.configData.TESTING_CONTRACT_ADDRESS,
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
                description: 'Should NOT sign a transaction with delegation when no gasPayer is provided (legacy)',
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
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
                expectedError: sdk_errors_1.NotDelegatedTransaction
            },
            {
                description: 'Should NOT sign a transaction with delegation when no gasPayer is provided (EIP-1559)',
                origin: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
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
                expectedError: sdk_errors_1.NotDelegatedTransaction
            }
        ]
    }
};
exports.signTransactionTestCases = signTransactionTestCases;
