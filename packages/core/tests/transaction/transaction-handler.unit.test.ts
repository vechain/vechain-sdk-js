import { Hex } from '../../src/vcdm/Hex';
import { Secp256k1, Transaction, TransactionHandler } from '../../src';
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
                    Buffer.from(Hex.of(signer.privateKey).bytes)
                );

                // Sign a non-delegated transaction with delegator
                expect(() =>
                    TransactionHandler.signWithDelegator(
                        transaction.body,
                        Buffer.from(Hex.of(signer.privateKey).bytes),
                        Buffer.from(Hex.of(delegator.privateKey).bytes)
                    )
                ).toThrowError(NotDelegatedTransaction);

                // Checks on signature
                expect(signedTransaction.isSigned).toBe(true);
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH
                );

                // Checks on origin, id and delegator
                expect(signedTransaction.origin).toBeDefined();
                expect(signedTransaction.origin.toString()).toBe(
                    signer.address
                );

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
                    Buffer.from(Hex.of(signer.privateKey).bytes),
                    Buffer.from(Hex.of(delegator.privateKey).bytes)
                );

                // Sign normally a delegated transaction
                expect(() =>
                    TransactionHandler.sign(
                        transaction.body,
                        Buffer.from(Hex.of(signer.privateKey).bytes)
                    )
                ).toThrowError(InvalidTransactionField);

                expect(() =>
                    TransactionHandler.sign(
                        transaction.body,
                        Buffer.from(Hex.of(delegator.privateKey).bytes)
                    )
                ).toThrowError(InvalidTransactionField);

                // Checks on signature
                expect(signedTransaction.isSigned).toBe(true);
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH * 2
                );

                // Checks on origin, id and delegator
                expect(signedTransaction.origin).toBeDefined();
                expect(signedTransaction.origin.toString()).toBe(
                    signer.address
                );
                expect(signedTransaction.delegator).toBeDefined();
                expect(signedTransaction.delegator.toString()).toBe(
                    delegator.address
                );
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
                    transactions.undelegated[0].body,
                    Buffer.from('INVALID', 'hex')
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);

            // Invalid private keys - delegated
            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactions.delegated[0].body,
                    Buffer.from('INVALID', 'hex'),
                    Buffer.from(Hex.of(delegator.privateKey).bytes)
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);

            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactions.delegated[0].body,
                    Buffer.from(Hex.of(signer.privateKey).bytes),
                    Buffer.from('INVALID', 'hex')
                );
            }).toThrowError(InvalidSecp256k1PrivateKey);

            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactions.delegated[0].body,
                    Buffer.from('INVALID', 'hex'),
                    Buffer.from('INVALID', 'hex')
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
                const decodedUnsigned = Transaction.decode(
                    Buffer.from(transaction.encodedUnsignedExpected),
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
                expect(decodedUnsigned.getSignatureHash().bytes.length).toBe(
                    32
                );
                expect(decodedUnsigned.encode).toBeDefined();
                expect(Hex.of(decodedUnsigned.encode).digits).toBe(
                    transactions.undelegated[0].encodedUnsignedExpected.toString(
                        'hex'
                    )
                );

                // Signed transaction
                const decodedSigned = Transaction.decode(
                    Buffer.from(transaction.encodedSignedExpected),
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
                expect(decodedSigned.getSignatureHash().bytes.length).toBe(32);
                expect(decodedSigned.encode).toBeDefined();
                expect(Hex.of(decodedSigned.encode).digits).toBe(
                    transactions.undelegated[0].encodedSignedExpected.toString(
                        'hex'
                    )
                );
                expect(decodedSigned.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH
                );
            });
        });

        /**
         * Delegated transactions decoding
         */
        describe('Should be able to encode delegated transactions', () => {
            transactions.delegated.forEach((transaction) => {
                // Unsigned transaction
                const decodedUnsigned = Transaction.decode(
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
                expect(decodedUnsigned.getSignatureHash().bytes.length).toBe(
                    32
                );
                expect(decodedUnsigned.encode).toBeDefined();
                expect(Hex.of(decodedUnsigned.encode)).toEqual(
                    Hex.of(transaction.encodedUnsignedExpected)
                );
                const encodedSignedDelegated =
                    TransactionHandler.signWithDelegator(
                        transactions.delegated[0].body,
                        Buffer.from(Hex.of(signer.privateKey).bytes),
                        Buffer.from(Hex.of(delegator.privateKey).bytes)
                    );

                // Signed transaction
                const decodedSigned = Transaction.decode(
                    encodedSignedDelegated.encode,
                    true
                );

                // Checks on decoded signed transaction
                expect(decodedSigned.body).toEqual(encodedSignedDelegated.body);
                expect(decodedSigned.signature).toBeDefined();
                expect(() => decodedSigned.origin).toBeDefined();
                expect(decodedSigned.origin.toString()).toBe(signer.address);
                expect(() => decodedSigned.delegator).toBeDefined();
                expect(decodedSigned.delegator.toString()).toBe(
                    delegator.address
                );
                expect(decodedSigned.isDelegated).toBe(true);
                expect(() => decodedSigned.id).toBeDefined();
                expect(decodedSigned.isSigned).toBe(true);
                expect(decodedSigned.getSignatureHash()).toBeDefined();
                expect(decodedSigned.getSignatureHash().bytes.length).toBe(32);
                expect(decodedSigned.encode).toBeDefined();
                expect(Hex.of(decodedSigned.encode)).toEqual(
                    Hex.of(encodedSignedDelegated.encode)
                );
                expect(decodedSigned.signature).toBeDefined();
                expect(decodedSigned.signature?.length).toBe(
                    Secp256k1.SIGNATURE_LENGTH * 2
                );
            });
        });

        /**
         * Invalid data decoding
         */
        test('Should throw error when decode with invalid data', () => {
            // Not trimmed reserved field error
            expect(() =>
                Transaction.decode(invalidDecodedNotTrimmedReserved, false)
            ).toThrowError(InvalidTransactionField);
        });
    });
});
