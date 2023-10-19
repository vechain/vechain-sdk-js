import { describe, expect, test } from '@jest/globals';
import {
    correctTransactionBody,
    delegatedCorrectTransactionBody,
    delegatorPrivateKey,
    encodedDelegatedUnsignedExpected,
    encodedSignedExpected,
    encodedUnsignedExpected,
    signerPrivateKey
} from './fixture';
import { ERRORS, Transaction, address, secp256k1 } from '../../src';

/**
 * Test transaction module - Creation
 */
describe('Transaction creation tests', () => {
    /**
     * Not delegated transactions
     */
    describe('Not delegated transactions', () => {
        /**
         * Testing the creation
         */
        test('Should be able to create transactions', () => {
            // Simple creation of unsigned transaction (signature should be undefined)
            const unsignedTransaction = new Transaction(correctTransactionBody);
            expect(unsignedTransaction.signature).toBeUndefined();
            expect(unsignedTransaction.isDelegated).toEqual(false);
            expect(unsignedTransaction.isSigned).toEqual(false);
            expect(
                unsignedTransaction.getSignatureHash().toString('hex')
            ).toEqual(
                '2a1c25ce0d66f45276a5f308b99bf410e2fc7d5b6ea37a49f2ab9f1da9446478'
            );

            // Get id from unsigned transaction (should throw error)
            expect(() => unsignedTransaction.id).toThrowError(
                ERRORS.TRANSACTION.NOT_SIGNED
            );

            // Get origin form unsigned transaction (should throw error)
            expect(() => unsignedTransaction.origin).toThrowError(
                ERRORS.TRANSACTION.NOT_SIGNED
            );

            // Get delegator form undelegeted transaction (should throw error)
            expect(() => unsignedTransaction.delegator).toThrowError(
                ERRORS.TRANSACTION.NOT_DELEGATED
            );

            // Simple creation of signed transaction (signature should be defined) @note Don't do this from scratch in real use. We have TransactionHandler for this. (THIS IS ONLY FOR TESTING PURPOSE)
            const transactionToSign = new Transaction(correctTransactionBody);
            const signature = secp256k1.sign(
                transactionToSign.getSignatureHash(),
                signerPrivateKey
            );
            const signedTransaction = new Transaction(
                correctTransactionBody,
                signature
            );
            expect(signedTransaction.signature).toBeDefined();
            expect(signedTransaction.isSigned).toEqual(true);
            expect(signedTransaction.isDelegated).toEqual(false);
            expect(
                signedTransaction.getSignatureHash().toString('hex')
            ).toEqual(
                '2a1c25ce0d66f45276a5f308b99bf410e2fc7d5b6ea37a49f2ab9f1da9446478'
            );
            expect(signedTransaction.origin).toEqual(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(signerPrivateKey)
                )
            );
            expect(signedTransaction.id).toEqual(
                '0xda90eaea52980bc4bb8d40cb2ff84d78433b3b4a6e7d50b75736c5e3e77b71ec'
            );

            // Simple creation of transaction with INVALID signature (should throw error)
            expect(
                () =>
                    new Transaction(
                        correctTransactionBody,
                        Buffer.from('INVALID_SIGNATURE')
                    )
            ).toThrowError(ERRORS.TRANSACTION.INVALID_SIGNATURE);
        });

        /**
         * Should be able to get signature hash
         */
        test('Should be able to get signature hash', () => {
            // Correct transaction
            const unsignedTransaction = new Transaction(correctTransactionBody);
            expect(
                unsignedTransaction.getSignatureHash().toString('hex')
            ).toEqual(
                '2a1c25ce0d66f45276a5f308b99bf410e2fc7d5b6ea37a49f2ab9f1da9446478'
            );
        });

        /**
         * Test delegation
         */
        test('Should be able to get delegation', () => {
            // Undelegate transaction
            const unsignedTransaction = new Transaction(correctTransactionBody);
            expect(unsignedTransaction.isDelegated).toEqual(false);
        });

        /**
         * Should be able to encode transactions
         */
        test('Should be able to encode transactions', () => {
            // Unsigend transaction
            const unsignedTransaction = new Transaction(correctTransactionBody);
            expect(unsignedTransaction.encoded).toEqual(
                encodedUnsignedExpected
            );

            // Signed transaction @note Don't do this from scratch in real use. We have TransactionHandler for this. (THIS IS ONLY FOR TESTING PURPOSE)
            const transactionToSign = new Transaction(correctTransactionBody);
            const signature = secp256k1.sign(
                transactionToSign.getSignatureHash(),
                signerPrivateKey
            );
            const signedTransaction = new Transaction(
                correctTransactionBody,
                signature
            );
            expect(signedTransaction.encoded).toEqual(encodedSignedExpected);
        });
    });

    /**
     * Delegated transactions
     */
    describe('Delegated transactions', () => {
        /**
         * Testing the creation
         */
        test('Should be able to create transactions', () => {
            // Simple creation of unsigned transaction (signature should be undefined)
            const unsignedTransaction = new Transaction(
                delegatedCorrectTransactionBody
            );
            expect(unsignedTransaction.signature).toBeUndefined();
            expect(unsignedTransaction.isSigned).toEqual(false);
            expect(unsignedTransaction.isDelegated).toEqual(true);

            // Can't get delegator from unsigned transaction (should throw error)
            expect(() => unsignedTransaction.delegator).toThrowError(
                ERRORS.TRANSACTION.NOT_SIGNED
            );

            // Simple creation of signed transaction (signature should be defined) @note Don't do this from scratch in real use. We have TransactionHandler for this. (THIS IS ONLY FOR TESTING PURPOSE)
            const transactionToSign = new Transaction(
                delegatedCorrectTransactionBody
            );

            const transactionHash = transactionToSign.getSignatureHash();
            const delegatedHash = transactionToSign.getSignatureHash(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(signerPrivateKey)
                )
            );
            const signature = Buffer.concat([
                secp256k1.sign(transactionHash, signerPrivateKey),
                secp256k1.sign(delegatedHash, delegatorPrivateKey)
            ]);
            const signedTransaction = new Transaction(
                delegatedCorrectTransactionBody,
                signature
            );
            expect(signedTransaction.isSigned).toEqual(true);
            expect(signedTransaction.isDelegated).toEqual(true);
            expect(signedTransaction.signature).toBeDefined();

            // Can get origin from signed transaction
            expect(signedTransaction.origin).toEqual(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(signerPrivateKey)
                )
            );

            // Can get delegator from signed transaction
            expect(signedTransaction.delegator).toEqual(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(delegatorPrivateKey)
                )
            );

            // Simple creation of transaction with INVALID signature (should throw error)
            expect(
                () =>
                    new Transaction(
                        delegatedCorrectTransactionBody,
                        Buffer.from('INVALID_SIGNATURE')
                    )
            ).toThrowError(ERRORS.TRANSACTION.INVALID_SIGNATURE);
        });

        /**
         * Should be able to get signature hash
         */
        test('Should be able to get signature hash', () => {
            // Correct transaction
            const unsignedTransaction = new Transaction(
                delegatedCorrectTransactionBody
            );
            const transactionHash = unsignedTransaction.getSignatureHash();
            const delegatorHash = unsignedTransaction.getSignatureHash(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(delegatorPrivateKey)
                )
            );

            // Both hash should be defined
            expect(transactionHash).toBeDefined();
            expect(delegatorHash).toBeDefined();

            // Different hash
            expect(transactionHash.toString('hex')).not.toEqual(
                delegatorHash.toString('hex')
            );

            // Try to get signature harh with invalid address
            expect(() =>
                unsignedTransaction.getSignatureHash('INVALID_ADDRESS')
            ).toThrowError(ERRORS.ADDRESS.INVALID_ADDRESS);
        });

        /**
         * Test delegation
         */
        test('Should be able to get delegation', () => {
            // Undelegate transaction
            const unsignedTransaction = new Transaction(
                delegatedCorrectTransactionBody
            );
            expect(unsignedTransaction.isDelegated).toEqual(true);
        });

        /**
         * Should be able to encode transactions
         */
        test('Should be able to encode transactions', () => {
            // Unsigend transaction
            const unsignedTransaction = new Transaction(
                delegatedCorrectTransactionBody
            );
            expect(unsignedTransaction.encoded).toEqual(
                encodedDelegatedUnsignedExpected
            );

            // Signed transaction @note Don't do this from scratch in real use. We have TransactionHandler for this. (THIS IS ONLY FOR TESTING PURPOSE)
            const transactionToSign = new Transaction(
                delegatedCorrectTransactionBody
            );

            const transactionHash = transactionToSign.getSignatureHash();
            const delegatedHash = transactionToSign.getSignatureHash(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(signerPrivateKey)
                )
            );
            const signature = Buffer.concat([
                secp256k1.sign(transactionHash, signerPrivateKey),
                secp256k1.sign(delegatedHash, delegatorPrivateKey)
            ]);
            const signedTransaction = new Transaction(
                delegatedCorrectTransactionBody,
                signature
            );
            expect(signedTransaction.encoded).toBeDefined();
            expect(signedTransaction.signature).toBeDefined();
        });
    });

    /**
     * Intrinsics gas calculation
     */
    test('Should be able to calculate intrinsics gas', () => {
        const tx = new Transaction(correctTransactionBody);
        expect(tx.intrinsicGas).toBe(37432);
    });
});
