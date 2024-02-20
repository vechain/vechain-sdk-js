import { describe, expect, test } from '@jest/globals';
import { SIGNATURE_LENGTH, Transaction, TransactionHandler } from '../../src';
import {
    transactions,
    invalidDecodedNotTrimmedReserved,
    signer,
    delegator
} from './fixture';
import {
    InvalidSecp256k1PrivateKeyError,
    TransactionAlreadySignedError,
    TransactionBodyError,
    TransactionDelegationError,
    TransactionNotSignedError
} from '@vechain/vechain-sdk-errors';

/**
 * Transaction handler tests
 * @group unit/transaction-handler
 */
describe('Transaction handler', () => {
    /**
     * Testing the signature of a transaction
     */
    describe('Signature', () => {
        /**
         * Not delegated transactions signature
         */
        describe('Should be able to sign not delegated transactions', () => {
            transactions.undelegated.forEach((transaction) => {
                const signedTransaction = TransactionHandler.sign(
                    { body: transaction.body },
                    signer.privateKey
                );

                // Sign already signed transaction
                expect(() =>
                    TransactionHandler.sign(
                        signedTransaction,
                        signer.privateKey
                    )
                ).toThrowError(TransactionAlreadySignedError);

                // Sign a non-delegated transaction with delegator
                expect(() =>
                    TransactionHandler.signWithDelegator(
                        new Transaction(transaction.body),
                        signer.privateKey,
                        delegator.privateKey
                    )
                ).toThrowError(TransactionDelegationError);

                // Checks on signature
                expect(signedTransaction.isSigned).toBe(true);
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.signature?.length).toBe(
                    SIGNATURE_LENGTH
                );

                // Checks on origin, id and delegator
                expect(signedTransaction.origin).toBeDefined();
                expect(signedTransaction.origin).toBe(signer.address);

                expect(() => signedTransaction.delegator).toThrowError(
                    TransactionDelegationError
                );
                expect(signedTransaction.isDelegated).toBe(false);
                expect(signedTransaction.id).toBeDefined();
            });
        });

        /**
         * Delegated transactions signature
         */
        describe('Should be able to sign delegated transactions', () => {
            transactions.delegated.forEach((transaction) => {
                const signedTransaction = TransactionHandler.signWithDelegator(
                    new Transaction(transaction.body),
                    signer.privateKey,
                    delegator.privateKey
                );

                // Sign already signed transaction
                expect(() =>
                    TransactionHandler.signWithDelegator(
                        signedTransaction,
                        signer.privateKey,
                        delegator.privateKey
                    )
                ).toThrowError(TransactionAlreadySignedError);

                // Sign normally a delegated transaction
                expect(() =>
                    TransactionHandler.sign(
                        new Transaction(transaction.body),
                        signer.privateKey
                    )
                ).toThrowError(TransactionDelegationError);

                expect(() =>
                    TransactionHandler.sign(
                        new Transaction(transaction.body),
                        delegator.privateKey
                    )
                ).toThrowError(TransactionDelegationError);

                // Checks on signature
                expect(signedTransaction.isSigned).toBe(true);
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.signature?.length).toBe(
                    SIGNATURE_LENGTH * 2
                );

                // Checks on origin, id and delegator
                expect(signedTransaction.origin).toBeDefined();
                expect(signedTransaction.origin).toBe(signer.address);
                expect(signedTransaction.delegator).toBeDefined();
                expect(signedTransaction.delegator).toBe(delegator.address);
                expect(signedTransaction.isDelegated).toBe(true);
                expect(signedTransaction.id).toBeDefined();
            });
        });

        /**
         * Invalid signature private key
         */
        test('Should throw error when sign with invalid private keys', () => {
            // Invalid private key - undelegated
            expect(() => {
                TransactionHandler.sign(
                    new Transaction(transactions.undelegated[0].body),
                    Buffer.from('INVALID', 'hex')
                );
            }).toThrowError(InvalidSecp256k1PrivateKeyError);

            // Invalid private keys - delegated
            expect(() => {
                TransactionHandler.signWithDelegator(
                    new Transaction(transactions.delegated[0].body),
                    Buffer.from('INVALID', 'hex'),
                    delegator.privateKey
                );
            }).toThrowError(InvalidSecp256k1PrivateKeyError);

            expect(() => {
                TransactionHandler.signWithDelegator(
                    new Transaction(transactions.delegated[0].body),
                    signer.privateKey,
                    Buffer.from('INVALID', 'hex')
                );
            }).toThrowError(InvalidSecp256k1PrivateKeyError);

            expect(() => {
                TransactionHandler.signWithDelegator(
                    new Transaction(transactions.delegated[0].body),
                    Buffer.from('INVALID', 'hex'),
                    Buffer.from('INVALID', 'hex')
                );
            }).toThrowError(InvalidSecp256k1PrivateKeyError);
        });
    });

    /**
     * Testing decoding of a transaction
     */
    describe('Decoding', () => {
        /**
         * Not delegated transactions decoding
         */
        describe('Should be able to encode not delegated transactions', () => {
            transactions.undelegated.forEach((transaction) => {
                // Unsigned transaction
                const decodedUnsigned = TransactionHandler.decode(
                    transaction.encodedUnsignedExpected,
                    false
                );

                // Checks on decoded unsigned transaction
                expect(decodedUnsigned.body).toEqual(
                    transactions.undelegated[0].body
                );
                expect(decodedUnsigned.signature).toBeUndefined();
                expect(() => decodedUnsigned.origin).toThrowError(
                    TransactionNotSignedError
                );
                expect(() => decodedUnsigned.delegator).toThrowError(
                    TransactionDelegationError
                );
                expect(decodedUnsigned.isDelegated).toBe(false);
                expect(() => decodedUnsigned.id).toThrowError(
                    TransactionNotSignedError
                );
                expect(decodedUnsigned.isSigned).toBe(false);
                expect(decodedUnsigned.getSignatureHash()).toBeDefined();
                expect(decodedUnsigned.getSignatureHash().length).toBe(32);
                expect(decodedUnsigned.encoded).toBeDefined();
                expect(decodedUnsigned.encoded.toString('hex')).toBe(
                    transactions.undelegated[0].encodedUnsignedExpected.toString(
                        'hex'
                    )
                );

                // Signed transaction
                const decodedSigned = TransactionHandler.decode(
                    transaction.encodedSignedExpected,
                    true
                );

                // Checks on decoded signed transaction
                expect(decodedSigned.body).toEqual(
                    transactions.undelegated[0].body
                );
                expect(decodedSigned.signature).toBeDefined();
                expect(() => decodedSigned.origin).toBeDefined();
                expect(() => decodedSigned.delegator).toBeDefined();
                expect(decodedSigned.isDelegated).toBe(false);
                expect(() => decodedSigned.id).toBeDefined();
                expect(decodedSigned.isSigned).toBe(true);
                expect(decodedSigned.getSignatureHash()).toBeDefined();
                expect(decodedSigned.getSignatureHash().length).toBe(32);
                expect(decodedSigned.encoded).toBeDefined();
                expect(decodedSigned.encoded.toString('hex')).toBe(
                    transactions.undelegated[0].encodedSignedExpected.toString(
                        'hex'
                    )
                );
                expect(decodedSigned.signature?.length).toBe(SIGNATURE_LENGTH);
            });
        });

        /**
         * Delegated transactions decoding
         */
        describe('Should be able to encode delegated transactions', () => {
            transactions.delegated.forEach((transaction) => {
                // Unsigned transaction
                const decodedUnsigned = TransactionHandler.decode(
                    transaction.encodedUnsignedExpected,
                    false
                );

                // Checks on decoded unsigned transaction
                expect(decodedUnsigned.body).toEqual(transaction.body);
                expect(decodedUnsigned.signature).toBeUndefined();
                expect(() => decodedUnsigned.origin).toThrowError(
                    TransactionNotSignedError
                );
                expect(() => decodedUnsigned.delegator).toThrowError(
                    TransactionNotSignedError
                );
                expect(decodedUnsigned.isDelegated).toBe(true);
                expect(() => decodedUnsigned.id).toThrowError(
                    TransactionNotSignedError
                );
                expect(decodedUnsigned.isSigned).toBe(false);
                expect(decodedUnsigned.getSignatureHash()).toBeDefined();
                expect(decodedUnsigned.getSignatureHash().length).toBe(32);
                expect(decodedUnsigned.encoded).toBeDefined();
                expect(decodedUnsigned.encoded.toString('hex')).toBe(
                    transaction.encodedUnsignedExpected.toString('hex')
                );
                const encodedSignedDelegated =
                    TransactionHandler.signWithDelegator(
                        new Transaction(transactions.delegated[0].body),
                        signer.privateKey,
                        delegator.privateKey
                    );

                // Signed transaction
                const decodedSigned = TransactionHandler.decode(
                    encodedSignedDelegated.encoded,
                    true
                );

                // Checks on decoded signed transaction
                expect(decodedSigned.body).toEqual(encodedSignedDelegated.body);
                expect(decodedSigned.signature).toBeDefined();
                expect(() => decodedSigned.origin).toBeDefined();
                expect(decodedSigned.origin).toBe(signer.address);
                expect(() => decodedSigned.delegator).toBeDefined();
                expect(decodedSigned.delegator).toBe(delegator.address);
                expect(decodedSigned.isDelegated).toBe(true);
                expect(() => decodedSigned.id).toBeDefined();
                expect(decodedSigned.isSigned).toBe(true);
                expect(decodedSigned.getSignatureHash()).toBeDefined();
                expect(decodedSigned.getSignatureHash().length).toBe(32);
                expect(decodedSigned.encoded).toBeDefined();
                expect(decodedSigned.encoded.toString('hex')).toBe(
                    encodedSignedDelegated.encoded.toString('hex')
                );
                expect(decodedSigned.signature).toBeDefined();
                expect(decodedSigned.signature?.length).toBe(
                    SIGNATURE_LENGTH * 2
                );
            });
        });

        /**
         * Invalid data decoding
         */
        test('Should throw error when decode with invalid data', () => {
            // Not trimmed reserved field error
            expect(() =>
                TransactionHandler.decode(
                    invalidDecodedNotTrimmedReserved,
                    false
                )
            ).toThrowError(TransactionBodyError);
        });
    });
});
