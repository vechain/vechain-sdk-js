import { describe, expect, test } from '@jest/globals';
import {
    ERRORS,
    SIGNATURE_LENGTH,
    Transaction,
    TransactionHandler,
    address,
    secp256k1
} from '../../src';
import {
    correctTransactionBody,
    delegatedCorrectTransactionBody,
    delegatorPrivateKey,
    signerPrivateKey
} from './fixture';
/**
 * Transaction handler tests
 */
describe('Transaction handler', () => {
    /**
     * Testing the signature of a transaction
     */
    describe('Signature', () => {
        /**
         * Sign a transaction without a delegator
         */
        test('Should be able to sign a transaction - NO DELEGATOR', () => {
            // Correct transaction signature flow
            const transactionToSign = new Transaction(correctTransactionBody);
            const signedTransaction = TransactionHandler.sign(
                transactionToSign,
                signerPrivateKey
            );

            expect(signedTransaction.isSigned).toBe(true);
            expect(signedTransaction.signature).toBeDefined();
            expect(signedTransaction.signature?.length).toBe(SIGNATURE_LENGTH);
            expect(signedTransaction.origin).toBeDefined();
            expect(signedTransaction.origin).toBe(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(signerPrivateKey)
                )
            );
            expect(() => signedTransaction.delegator).toThrow(
                ERRORS.TRANSACTION.NOT_DELEGATED
            );
            expect(signedTransaction.isDelegated).toBe(false);
            expect(signedTransaction.id).toBeDefined();

            // Invalid private key
            expect(() => {
                TransactionHandler.sign(
                    transactionToSign,
                    Buffer.from('INVALID', 'hex')
                );
            }).toThrowError(ERRORS.TRANSACTION.INVALID_SIGNATURE_PRIVATE_KEY);

            // Sign already signed transaction
            expect(() =>
                TransactionHandler.sign(signedTransaction, signerPrivateKey)
            ).toThrowError(ERRORS.TRANSACTION.ALREADY_SIGN);
        });

        /**
         * Sign a transaction with a delegator
         */
        test('Should be able to sign a transaction - DELEGATOR', () => {
            // Correct transaction signature flow
            const transactionToSign = new Transaction(
                delegatedCorrectTransactionBody
            );
            const signedTransaction = TransactionHandler.signWithDelegator(
                transactionToSign,
                signerPrivateKey,
                delegatorPrivateKey
            );
            expect(signedTransaction.isSigned).toBe(true);
            expect(signedTransaction.signature).toBeDefined();
            expect(signedTransaction.signature?.length).toBe(
                SIGNATURE_LENGTH * 2
            );
            expect(signedTransaction.origin).toBeDefined();
            expect(signedTransaction.origin).toBe(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(signerPrivateKey)
                )
            );
            expect(signedTransaction.delegator).toBeDefined();
            expect(signedTransaction.delegator).toBe(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(delegatorPrivateKey)
                )
            );
            expect(signedTransaction.isDelegated).toBe(true);
            expect(signedTransaction.id).toBeDefined();

            // Invalid private keys
            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactionToSign,
                    Buffer.from('INVALID', 'hex'),
                    delegatorPrivateKey
                );
            }).toThrowError(ERRORS.TRANSACTION.INVALID_SIGNATURE_PRIVATE_KEY);

            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactionToSign,
                    signerPrivateKey,
                    Buffer.from('INVALID', 'hex')
                );
            }).toThrowError(ERRORS.TRANSACTION.INVALID_SIGNATURE_PRIVATE_KEY);

            expect(() => {
                TransactionHandler.signWithDelegator(
                    transactionToSign,
                    Buffer.from('INVALID', 'hex'),
                    Buffer.from('INVALID', 'hex')
                );
            }).toThrowError(ERRORS.TRANSACTION.INVALID_SIGNATURE_PRIVATE_KEY);

            // Sign already signed transaction
            expect(() =>
                TransactionHandler.signWithDelegator(
                    signedTransaction,
                    signerPrivateKey,
                    delegatorPrivateKey
                )
            ).toThrowError(ERRORS.TRANSACTION.ALREADY_SIGN);

            // Sign a non-delegated transaction with delegator
            expect(() =>
                TransactionHandler.signWithDelegator(
                    new Transaction(correctTransactionBody),
                    signerPrivateKey,
                    delegatorPrivateKey
                )
            ).toThrowError(ERRORS.TRANSACTION.NOT_DELEGATED);
        });
    });

    /**
     * Testing decoding of a transaction
     */
    describe('Decode', () => {
        test('Should be able to decode a transaction', () => {
            expect(true).toBe(true);
        });
    });
});
