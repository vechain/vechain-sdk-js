import { Hex } from '../../src/vcdm/Hex';
import { HexUInt, SIGNATURE_LENGTH, TransactionHandler } from '../../src';
import { describe, expect, test } from '@jest/globals';
import {
    delegator,
    invalidDecodedNotTrimmedReserved,
    signer,
    transactions
} from './fixture';
import {
    InvalidSecp256k1PrivateKey,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';

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
                    transaction.body,
                    HexUInt.of(signer.privateKey).bytes
                );

                // Sign a non-delegated transaction with delegator
                expect(() =>
                    TransactionHandler.signWithDelegator(
                        transaction.body,
                        HexUInt.of(signer.privateKey).bytes,
                        HexUInt.of(delegator.privateKey).bytes
                    )
                ).toThrowError(NotDelegatedTransaction);

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
                    NotDelegatedTransaction
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
                    transaction.body,
                    HexUInt.of(signer.privateKey).bytes,
                    HexUInt.of(delegator.privateKey).bytes
                );

                // Sign normally a delegated transaction
                expect(() =>
                    TransactionHandler.sign(
                        transaction.body,
                        HexUInt.of(signer.privateKey).bytes
                    )
                ).toThrowError(InvalidTransactionField);

                expect(() =>
                    TransactionHandler.sign(
                        transaction.body,
                        HexUInt.of(delegator.privateKey).bytes
                    )
                ).toThrowError(InvalidTransactionField);

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
            const invalid = new TextEncoder().encode('INVALID');
            // Invalid private key - undelegated
            expect(() => {
                TransactionHandler.sign(
                    transactions.undelegated[0].body,
                    invalid
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);

            // Invalid private keys - delegated
            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactions.delegated[0].body,
                    invalid,
                    HexUInt.of(delegator.privateKey).bytes
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);

            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactions.delegated[0].body,
                    HexUInt.of(signer.privateKey).bytes,
                    invalid
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);

            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactions.delegated[0].body,
                    invalid,
                    invalid
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);
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
                    UnavailableTransactionField
                );
                expect(() => decodedUnsigned.delegator).toThrowError(
                    NotDelegatedTransaction
                );
                expect(decodedUnsigned.isDelegated).toBe(false);
                expect(() => decodedUnsigned.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(decodedUnsigned.isSigned).toBe(false);
                expect(decodedUnsigned.getSignatureHash()).toBeDefined();
                expect(decodedUnsigned.getSignatureHash().length).toBe(32);
                expect(decodedUnsigned.encoded).toBeDefined();
                expect(Hex.of(decodedUnsigned.encoded).digits).toBe(
                    Hex.of(transactions.undelegated[0].encodedUnsignedExpected)
                        .digits
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
                expect(Hex.of(decodedSigned.encoded).digits).toBe(
                    Hex.of(transactions.undelegated[0].encodedSignedExpected)
                        .digits
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
                    UnavailableTransactionField
                );
                expect(() => decodedUnsigned.delegator).toThrowError(
                    UnavailableTransactionField
                );
                expect(decodedUnsigned.isDelegated).toBe(true);
                expect(() => decodedUnsigned.id).toThrowError(
                    UnavailableTransactionField
                );
                expect(decodedUnsigned.isSigned).toBe(false);
                expect(decodedUnsigned.getSignatureHash()).toBeDefined();
                expect(decodedUnsigned.getSignatureHash().length).toBe(32);
                expect(decodedUnsigned.encoded).toBeDefined();
                expect(Hex.of(decodedUnsigned.encoded)).toEqual(
                    Hex.of(transaction.encodedUnsignedExpected)
                );
                const encodedSignedDelegated =
                    TransactionHandler.signWithDelegator(
                        transactions.delegated[0].body,
                        HexUInt.of(signer.privateKey).bytes,
                        HexUInt.of(delegator.privateKey).bytes
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
                expect(Hex.of(decodedSigned.encoded)).toEqual(
                    Hex.of(encodedSignedDelegated.encoded)
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
            ).toThrowError(InvalidTransactionField);
        });
    });
});
