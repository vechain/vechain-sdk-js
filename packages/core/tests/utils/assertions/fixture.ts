import { secp256k1, Transaction, TransactionHandler } from '../../../src';
import {
    generateRandomTransactionHead,
    generateRandomTransactionID,
    generateRandomValidAddress
} from '../../fixture';
import { signer, transactions } from '../../transaction/fixture';

/**
 * Account assertion tests
 */
const accountAssertionsTests = {
    assertIsAddress: {
        valid: [
            {
                value: generateRandomValidAddress()
            }
        ],
        invalid: [
            {
                value: '0x'
            },
            {
                value: '0x0'
            }
        ]
    }
};

/**
 * Transaction assertion tests
 */
const transactionAssertionsTests = {
    assertValidTransactionID: {
        valid: [
            {
                value: generateRandomTransactionID()
            }
        ],
        invalid: [
            {
                value: '0x'
            },
            {
                value: '0x0'
            }
        ]
    },
    assertValidTransactionHead: {
        valid: [
            {
                value: generateRandomTransactionHead()
            },
            {
                value: undefined
            }
        ],
        invalid: [
            {
                value: '0x'
            },
            {
                value: '0x0'
            }
        ]
    },
    assertIsSignedTransaction: {
        valid: [
            {
                value: TransactionHandler.sign(
                    transactions.undelegated[0].body,
                    signer.privateKey
                )
            }
        ],
        invalid: [
            {
                value: new Transaction({
                    ...transactions.undelegated[0].body
                })
            }
        ]
    },
    assertIsValidTransactionSigningPrivateKey: {
        valid: [
            {
                value: signer.privateKey
            },
            {
                value: secp256k1.generatePrivateKey()
            }
        ],
        invalid: [
            {
                value: secp256k1.randomBytes(1)
            },
            {
                value: secp256k1.randomBytes(31)
            },
            {
                value: secp256k1.randomBytes(33)
            },
            {
                value: secp256k1.randomBytes(66)
            },
            {
                value: secp256k1.randomBytes(65)
            }
        ]
    }
};

/**
 * Block assertion tests
 */
const blockAssertionsTests = {
    assertIsRevisionForAccount: {
        valid: [
            {
                value: '0x542fd'
            },
            {
                value: '100'
            },
            {
                value: 100
            },
            {
                value: 'best'
            }
        ],
        invalid: [
            {
                value: 'invalid-revision'
            },
            {
                value: '0xG8656c6c6f'
            },
            {
                value: 'finalized'
            }
        ]
    },
    assertIsRevisionForBlock: {
        valid: [
            {
                value: '0x542fd'
            },
            {
                value: '100'
            },
            {
                value: 100
            },
            {
                value: 'best'
            },
            {
                value: 'finalized'
            }
        ],
        invalid: [
            {
                value: 'invalid-revision'
            },
            {
                value: '0xG8656c6c6f'
            }
        ]
    }
};

export {
    accountAssertionsTests,
    transactionAssertionsTests,
    blockAssertionsTests
};
