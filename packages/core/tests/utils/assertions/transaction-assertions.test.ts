import { describe, expect, test } from '@jest/globals';
import { transactionAssertionsTests } from './fixture';
import {
    assertIsSignedTransaction,
    assertIsValidTransactionSigningPrivateKey,
    assertValidTransactionHead,
    assertValidTransactionID,
    secp256k1
} from '../../../src';
import { InvalidSecp256k1PrivateKeyError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Transaction assertions
 *
 * @group unit/utils-assertions
 */
describe('Transaction assertions', () => {
    /**
     * Assert valid transaction ID test suite
     */
    describe('assertValidTransactionID', () => {
        /**
         * Valid transaction IDs test cases
         */
        transactionAssertionsTests.assertValidTransactionID.valid.forEach(
            ({ value }) => {
                test(`should not throw error for assertValidTransactionID of ${value}`, () => {
                    // Expect assertValidTransactionID to not throw
                    expect(() => {
                        assertValidTransactionID(value);
                    }).not.toThrow();
                });
            }
        );

        /**
         * Invalid transaction IDs test cases
         */
        transactionAssertionsTests.assertValidTransactionID.invalid.forEach(
            ({ value }) => {
                test(`should throw error for assertValidTransactionID of ${value}`, () => {
                    // Expect assertValidTransactionID to throw
                    expect(() => {
                        assertValidTransactionID(value);
                    }).toThrowError();
                });
            }
        );
    });

    describe('assertValidTransactionHead', () => {
        /**
         * Valid transaction heads test cases
         */
        transactionAssertionsTests.assertValidTransactionHead.valid.forEach(
            ({ value }) => {
                test(`should not throw error for assertValidTransactionHead of ${value}`, () => {
                    // Expect assertValidTransactionHead to not throw
                    expect(() => {
                        assertValidTransactionHead(value);
                    }).not.toThrow();
                });
            }
        );

        /**
         * Invalid transaction heads test cases
         */
        transactionAssertionsTests.assertValidTransactionHead.invalid.forEach(
            ({ value }) => {
                test(`should throw error for assertValidTransactionHead of ${value}`, () => {
                    // Expect assertValidTransactionHead to throw
                    expect(() => {
                        assertValidTransactionHead(value);
                    }).toThrowError();
                });
            }
        );
    });

    /**
     * Assert is signed transaction test suite
     */
    describe('assertIsSignedTransaction', () => {
        /**
         * Valid signed transactions test cases
         */
        transactionAssertionsTests.assertIsSignedTransaction.valid.forEach(
            ({ value }) => {
                test(`should not throw error for assertIsSignedTransaction of ${JSON.stringify(
                    value
                )}`, () => {
                    // Expect assertIsSignedTransaction to not throw
                    expect(() => {
                        assertIsSignedTransaction(value);
                    }).not.toThrow();
                });
            }
        );

        /**
         * Invalid signed transactions test cases
         */
        transactionAssertionsTests.assertIsSignedTransaction.invalid.forEach(
            ({ value }) => {
                test(`should throw error for assertIsSignedTransaction of ${JSON.stringify(
                    value
                )}`, () => {
                    // Expect assertIsSignedTransaction to throw
                    expect(() => {
                        assertIsSignedTransaction(value);
                    }).toThrowError();
                });
            }
        );
    });

    describe('assertIsValidTransactionSigningPrivateKey', () => {
        /**
         * Valid private keys test cases
         */
        transactionAssertionsTests.assertIsValidTransactionSigningPrivateKey.valid.forEach(
            ({ value }) => {
                test(`should not throw error for assertIsValidTransactionSigningPrivateKey of ${value.toString(
                    'hex'
                )}`, () => {
                    // Expect assertIsValidTransactionSigningPrivateKey to not throw
                    expect(() => {
                        assertIsValidTransactionSigningPrivateKey(
                            value,
                            secp256k1.isValidPrivateKey,
                            'signer'
                        );
                    }).not.toThrow();
                });
            }
        );

        /**
         * Invalid private keys test cases
         */
        transactionAssertionsTests.assertIsValidTransactionSigningPrivateKey.invalid.forEach(
            ({ value }) => {
                test(`should throw error for assertIsValidTransactionSigningPrivateKey of ${value.toString(
                    'hex'
                )}`, () => {
                    // Expect assertIsValidTransactionSigningPrivateKey to throw
                    expect(() => {
                        assertIsValidTransactionSigningPrivateKey(
                            value,
                            () => false
                        );
                    }).toThrow(InvalidSecp256k1PrivateKeyError);
                });
            }
        );
    });
});
