import { describe, expect, test } from '@jest/globals';
import { signer, delegator, transactions } from './fixture';
import { Transaction, TransactionHandler } from '../../src';
import {
    InvalidAddressError,
    InvalidSecp256k1SignatureError,
    TransactionBodyError,
    TransactionDelegationError,
    TransactionNotSignedError
} from '@vechainfoundation/errors';

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
                    unsignedTransaction.getSignatureHash().toString('hex')
                ).toEqual(transaction.signatureHashExpected);

                // Get id from unsigned transaction (should throw error)
                expect(() => unsignedTransaction.id).toThrowError(
                    TransactionNotSignedError
                );

                // Get origin form unsigned transaction (should throw error)
                expect(() => unsignedTransaction.origin).toThrowError(
                    TransactionNotSignedError
                );

                // Get delegator form unsigned and undelegated transaction (should throw error)
                expect(() => unsignedTransaction.delegator).toThrowError(
                    TransactionDelegationError
                );

                // Encoding
                expect(unsignedTransaction.encoded).toEqual(
                    transaction.encodedUnsignedExpected
                );

                // Intrinsic gas
                expect(unsignedTransaction.intrinsicGas).toBe(37432);

                // Try to get signature hash with invalid address
                expect(() =>
                    unsignedTransaction.getSignatureHash('INVALID_ADDRESS')
                ).toThrowError(InvalidAddressError);
            });
        });

        /**
         * Testing creation of signed transaction
         */
        test('Should be able to create signed transactions', () => {
            transactions.undelegated.forEach((transaction) => {
                // Init unsigned transaction from body
                const signedTransaction = TransactionHandler.sign(
                    new Transaction(transaction.body),
                    signer.privateKey
                );

                // Checks on signature
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.isSigned).toEqual(true);
                expect(signedTransaction.isDelegated).toEqual(false);
                expect(
                    signedTransaction.getSignatureHash().toString('hex')
                ).toEqual(transaction.signatureHashExpected);

                // Checks on origin, id and delegator
                expect(signedTransaction.origin).toEqual(signer.address);
                expect(signedTransaction.id).toEqual(
                    transaction.signedTransactionIdExpected
                );

                // Get delegator form undelegeted signed transaction (should throw error)
                expect(() => signedTransaction.delegator).toThrowError(
                    TransactionDelegationError
                );

                // Encoding
                expect(signedTransaction.encoded).toEqual(
                    transaction.encodedSignedExpected
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
                    unsignedTransaction.getSignatureHash().toString('hex')
                ).toEqual(transaction.signatureHashExpected);

                // Get id from unsigned transaction (should throw error)
                expect(() => unsignedTransaction.id).toThrowError(
                    TransactionNotSignedError
                );

                // Get origin form unsigned transaction (should throw error)
                expect(() => unsignedTransaction.origin).toThrowError(
                    TransactionNotSignedError
                );

                // Get delegator form unsigned transaction (should throw error)
                expect(() => unsignedTransaction.delegator).toThrowError(
                    TransactionNotSignedError
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
                    new Transaction(transaction.body),
                    signer.privateKey,
                    delegator.privateKey
                );

                // Checks on signature
                expect(signedTransaction.signature).toBeDefined();
                expect(signedTransaction.isSigned).toEqual(true);
                expect(signedTransaction.isDelegated).toEqual(true);
                expect(
                    signedTransaction.getSignatureHash().toString('hex')
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
                    Buffer.from('INVALID_SIGNATURE')
                )
        ).toThrowError(InvalidSecp256k1SignatureError);

        // Invalid transaction body (should throw error)
        expect(
            () =>
                new Transaction({
                    ...transactions.delegated[0].body,
                    blockRef: 'INVALID_BLOCK_REF'
                })
        ).toThrowError(TransactionBodyError);
    });
});
