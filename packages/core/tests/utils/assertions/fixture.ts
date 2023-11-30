import { Transaction, TransactionHandler } from '../../../src';
import { signer, transactions } from '../../transaction/fixture';

/**
 * Generates a random buffer of the specified length
 *
 * @param length - The length of the buffer to generate
 * @returns A random buffer of the specified length
 */
const generateRandomBytes = (length: number): Buffer => {
    const buffer = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
        // Generate a random byte
        buffer[i] = Math.floor(Math.random() * 256);
    }

    return buffer;
};

/**
 * Generates a random valid address
 *
 * @returns A random valid address of 20 bytes
 */
const generateRandomValidAddress = (): string => {
    const buffer = generateRandomBytes(20);

    return '0x' + buffer.toString('hex');
};

/**
 * Generates a random valid transaction ID
 *
 * @returns A random valid transaction ID of 32 bytes
 */
const generateRandomTransactionID = (): string => {
    const buffer = generateRandomBytes(32);

    return '0x' + buffer.toString('hex');
};

/**
 * Generates a random valid transaction head
 *
 * @returns - A random valid transaction head of 32 bytes
 */
const generateRandomTransactionHead = (): string => {
    return generateRandomTransactionID();
};

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
                    new Transaction({
                        ...transactions.undelegated[0].body
                    }),
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
