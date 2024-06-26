import { describe, expect, test } from '@jest/globals';
import { transactionAssertionsTests } from './fixture';
import {
    assertIsSignedTransaction,
    assertIsValidTransactionSigningPrivateKey,
    assertValidTransactionHead,
    assertValidTransactionID,
    Hex,
    secp256k1
} from '../../../src';
import {
    InvalidSecp256k1PrivateKeyError,
    stringifyData
} from '@vechain/sdk-errors';

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
                        assertValidTransactionID('test', value);
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
                        assertValidTransactionID('test', value);
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
                        assertValidTransactionHead('test', value);
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
                        assertValidTransactionHead('test', value);
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
                test(`should not throw error for assertIsSignedTransaction of ${stringifyData(
                    value
                )}`, () => {
                    // Expect assertIsSignedTransaction to not throw
                    expect(() => {
                        assertIsSignedTransaction('test', value);
                    }).not.toThrow();
                });
            }
        );

        /**
         * Invalid signed transactions test cases
         */
        transactionAssertionsTests.assertIsSignedTransaction.invalid.forEach(
            ({ value }) => {
                test(`should throw error for assertIsSignedTransaction of ${stringifyData(
                    value
                )}`, () => {
                    // Expect assertIsSignedTransaction to throw
                    expect(() => {
                        assertIsSignedTransaction('test', value);
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
                            'test',
                            Buffer.from(value),
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
                test(`should throw error for assertIsValidTransactionSigningPrivateKey of ${Hex.of(value)}`, () => {
                    // Expect assertIsValidTransactionSigningPrivateKey to throw
                    expect(() => {
                        assertIsValidTransactionSigningPrivateKey(
                            'test',
                            Buffer.from(value),
                            () => false
                        );
                    }).toThrow(InvalidSecp256k1PrivateKeyError);
                });
            }
        );
    });
});
