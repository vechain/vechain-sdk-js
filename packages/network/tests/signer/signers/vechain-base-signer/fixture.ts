import { TEST_ACCOUNTS, TESTNET_DELEGATE_URL } from '../../../fixture';
import { type SignTransactionOptions } from '../../../../src';

/**
 * SignTransaction test cases
 * Has both correct and incorrect for solo and an example of using delegatorUrl on testnet
 */
const signTransactionTestCases = {
    solo: {
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
         * ----- START: TEMPORARY COMMENT -----
         * Make more incorrect tst cases coherent with the new structure
         * ----- END: TEMPORARY COMMENT -----
         */
        incorrect: [
            // {
            //     description:
            //         "Should throw error when delegator's private key is invalid",
            //     origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
            //     options: {
            //         delegatorPrivateKey: 'INVALID_PRIVATE_KEY'
            //     } satisfies SignTransactionOptions,
            //     isDelegated: true,
            //     expectedError: InvalidSecp256k1PrivateKeyError
            // }
            // {
            //     description:
            //         'Should throw error when delegator private key is invalid',
            //     origin: {
            //         privateKey: '0x',
            //         address: '0x'
            //     },
            //     isDelegated: true,
            //     expectedError: InvalidSecp256k1PrivateKeyError
            // },
            // {
            //     description:
            //         "Should throw error when using delegator url on solo network due to no server providing the delegator's signature through an endpoint",
            //     origin: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER,
            //     options: {
            //         delegatorUrl: 'https://example.com'
            //     } satisfies SignTransactionOptions,
            //     isDelegated: true,
            //     expectedError: TransactionDelegationError
            // }
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

export { signTransactionTestCases };
