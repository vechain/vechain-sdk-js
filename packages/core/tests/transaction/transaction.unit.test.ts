import { describe, expect, test } from '@jest/globals';
import {
    InvalidSecp256k1Signature,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';
import { Transaction, TransactionHandler } from '../../src';
import { Hex } from '../../src/vcdm/Hex';
import { delegator, signer, transactions } from './fixture';

/**
 * Test transaction module
 * @group unit/transaction
 */
describe('Transaction', () => {
    /**
     * Not delegated transactions
     */
    describe('Not delegated transactions', () => {
        /**
         * Testing creation of unsigned transaction
         */
        test('Should be able to create unsigned transactions', () => {
            transactions.undelegated.forEach((transaction) => {
                // Init unsigned transaction from body
                const unsignedTransaction = new Transaction(transaction.body);

                // Checks
                expect(unsignedTransaction.signature).toBeUndefined();
                expect(unsignedTransaction.isSigned).toEqual(false);
                expect(unsignedTransaction.isDelegated).toEqual(false);
                expect(
                    Hex.of(unsignedTransaction.getSignatureHash()).toString()
                ).toEqual(transaction.signatureHashExpected);

                // Get id from unsigned transaction (should throw error)
                expect(() => unsignedTransaction.id).toThrowError(
                    UnavailableTransactionField
                );

                // Get origin form unsigned transaction (should throw error)
                expect(() => unsignedTransaction.origin).toThrowError(
                    UnavailableTransactionField
                );

                // Get delegator form unsigned and undelegated transaction (should throw error)
                expect(() => unsignedTransaction.delegator).toThrowError(
                    NotDelegatedTransaction
                );

                // Encoding
                expect(unsignedTransaction.encoded).toEqual(
                    Uint8Array.from(
                        Hex.of(transaction.encodedUnsignedExpected).bytes
                    )
                );

                // Intrinsic gas
                expect(unsignedTransaction.intrinsicGas).toBe(37432);

                // Try to get signature hash with invalid address
                expect(() =>
                    unsignedTransaction.getSignatureHash('INVALID_ADDRESS')
                ).toThrowError(InvalidTransactionField);
            });
        });

        /**
         * Testing creation of signed transaction
         */
        test('Should be able to create signed transactions', () => {
            transactions.undelegated.forEach((transaction) => {
                // Init unsigned transaction from body
                const signedTransaction = TransactionHandler.sign(
                    transaction.body,
                    Uint8Array.from(Hex.of(signer.privateKey).bytes)
                );

                // Checks on signature
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.isSigned).toEqual(true);
                expect(signedTransaction.isDelegated).toEqual(false);
                expect(
                    Hex.of(signedTransaction.getSignatureHash()).toString()
                ).toEqual(transaction.signatureHashExpected);

                // Checks on origin, id and delegator
                expect(signedTransaction.origin).toEqual(signer.address);
                expect(signedTransaction.id).toEqual(
                    transaction.signedTransactionIdExpected
                );

                // Get delegator form undelegated signed transaction (should throw error)
                expect(() => signedTransaction.delegator).toThrowError(
                    NotDelegatedTransaction
                );

                // Encoding
                expect(signedTransaction.encoded).toEqual(
                    Uint8Array.from(
                        Hex.of(transaction.encodedSignedExpected).bytes
                    )
                );
            });
        });
    });

    /**
     * Delegated transactions
     */
    describe('Delegated transactions', () => {
        /**
         * Testing creation of unsigned transaction
         */
        test('Should be able to create unsigned transactions', () => {
            transactions.delegated.forEach((transaction) => {
                // Init unsigned transaction from body
                const unsignedTransaction = new Transaction(transaction.body);

                // Checks
                expect(unsignedTransaction.signature).toBeUndefined();
                expect(unsignedTransaction.isSigned).toEqual(false);
                expect(unsignedTransaction.isDelegated).toEqual(true);
                expect(
                    Hex.of(unsignedTransaction.getSignatureHash()).toString()
                ).toEqual(transaction.signatureHashExpected);

                // Get id from unsigned transaction (should throw error)
                expect(() => unsignedTransaction.id).toThrowError(
                    UnavailableTransactionField
                );

                // Get origin form unsigned transaction (should throw error)
                expect(() => unsignedTransaction.origin).toThrowError(
                    UnavailableTransactionField
                );

                // Get delegator form unsigned transaction (should throw error)
                expect(() => unsignedTransaction.delegator).toThrowError(
                    UnavailableTransactionField
                );

                // Encoding
                expect(unsignedTransaction.encoded).toEqual(
                    transaction.encodedUnsignedExpected
                );

                // Intrinsic gas
                expect(unsignedTransaction.intrinsicGas).toBe(37432);
            });
        });

        /**
         * Testing creation of signed transaction
         */
        test('Should be able to create signed transactions', () => {
            transactions.delegated.forEach((transaction) => {
                const signedTransaction = TransactionHandler.signWithDelegator(
                    transaction.body,
                    Uint8Array.from(Hex.of(signer.privateKey).bytes),
                    Uint8Array.from(Hex.of(delegator.privateKey).bytes)
                );

                // Checks on signature
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.isSigned).toEqual(true);
                expect(signedTransaction.isDelegated).toEqual(true);
                expect(
                    Hex.of(signedTransaction.getSignatureHash()).toString()
                ).toEqual(transaction.signatureHashExpected);

                // Checks on origin, id and delegator
                expect(signedTransaction.origin).toEqual(signer.address);
                expect(signedTransaction.delegator).toEqual(delegator.address);
                expect(signedTransaction.id).toEqual(
                    transaction.signedTransactionIdExpected
                );

                // Encoding
                expect(signedTransaction.encoded).toEqual(
                    transaction.encodedSignedExpected
                );
            });
        });
    });

    /**
     * Invalid transactions
     */
    test('Invalid transactions', () => {
        // Invalid signature (should throw error)
        expect(
            () =>
                new Transaction(
                    transactions.delegated[0].body,
                    Uint8Array.from(
                        new TextEncoder().encode('INVALID_SIGNATURE')
                    )
                )
        ).toThrowError(InvalidSecp256k1Signature);

        // Invalid transaction body (should throw error)
        expect(
            () =>
                new Transaction({
                    ...transactions.delegated[0].body,
                    blockRef: 'INVALID_BLOCK_REF'
                })
        ).toThrowError(InvalidTransactionField);
    });
});
