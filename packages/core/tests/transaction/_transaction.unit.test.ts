import { describe, expect, test } from '@jest/globals';
import { delegator, signer, transactions } from './fixture';
import { HexUInt, Transaction, TransactionHandler } from '../../src';
import {
    InvalidSecp256k1Signature,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';
import { Hex } from '../../src/vcdm/Hex';

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
                const unsignedTransaction = Transaction.of(transaction.body);

                // Checks
                expect(unsignedTransaction.signature).toBeUndefined();
                expect(unsignedTransaction.isSigned).toEqual(false);
                expect(unsignedTransaction.isDelegated).toEqual(false);
                expect(
                    Hex.of(
                        unsignedTransaction.getSignatureHash().bytes
                    ).toString()
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
                expect(unsignedTransaction.bytes).toEqual(
                    Hex.of(transaction.encodedUnsignedExpected).bytes
                );

                // Intrinsic gas
                expect(unsignedTransaction.intrinsicGas.wei).toBe(37432n);
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
                    Buffer.from(HexUInt.of(signer.privateKey).bytes)
                );

                // Checks on signature
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.isSigned).toEqual(true);
                expect(signedTransaction.isDelegated).toEqual(false);
                expect(
                    Hex.of(
                        signedTransaction.getSignatureHash().bytes
                    ).toString()
                ).toEqual(transaction.signatureHashExpected);

                // Checks on origin, id and delegator
                expect(signedTransaction.origin.toString()).toEqual(
                    signer.address
                );
                expect(signedTransaction.id.toString()).toEqual(
                    transaction.signedTransactionIdExpected
                );

                // Get delegator form undelegated signed transaction (should throw error)
                expect(() => signedTransaction.delegator).toThrowError(
                    NotDelegatedTransaction
                );

                // Encoding
                expect(signedTransaction.bytes).toEqual(
                    Hex.of(transaction.encodedSignedExpected).bytes
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
                const unsignedTransaction = Transaction.of(transaction.body);

                // Checks
                expect(unsignedTransaction.signature).toBeUndefined();
                expect(unsignedTransaction.isSigned).toEqual(false);
                expect(unsignedTransaction.isDelegated).toEqual(true);
                expect(
                    Hex.of(
                        unsignedTransaction.getSignatureHash().bytes
                    ).toString()
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
                expect(Buffer.from(unsignedTransaction.bytes)).toEqual(
                    transaction.encodedUnsignedExpected
                );

                // Intrinsic gas
                expect(unsignedTransaction.intrinsicGas.wei).toBe(37432n);
            });
        });

        /**
         * Testing creation of signed transaction
         */
        test('Should be able to create signed transactions', () => {
            transactions.delegated.forEach((transaction) => {
                const signedTransaction = TransactionHandler.signWithDelegator(
                    transaction.body,
                    Buffer.from(Hex.of(signer.privateKey).bytes),
                    Buffer.from(Hex.of(delegator.privateKey).bytes)
                );

                // Checks on signature
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.isSigned).toEqual(true);
                expect(signedTransaction.isDelegated).toEqual(true);
                expect(
                    Hex.of(
                        signedTransaction.getSignatureHash().bytes
                    ).toString()
                ).toEqual(transaction.signatureHashExpected);

                // Checks on origin, id and delegator
                expect(signedTransaction.origin.toString()).toEqual(
                    signer.address
                );
                expect(signedTransaction.delegator.toString()).toEqual(
                    delegator.address
                );
                expect(signedTransaction.id.toString()).toEqual(
                    transaction.signedTransactionIdExpected
                );

                // Encoding
                expect(Buffer.from(signedTransaction.bytes)).toEqual(
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
        expect(() =>
            Transaction.of(
                transactions.delegated[0].body,
                Buffer.from('INVALID_SIGNATURE')
            )
        ).toThrowError(InvalidSecp256k1Signature);

        // Invalid transaction body (should throw error)
        expect(() =>
            Transaction.of({
                ...transactions.delegated[0].body,
                blockRef: 'INVALID_BLOCK_REF'
            })
        ).toThrowError(InvalidTransactionField);
    });
});
