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
    delegatedCorrectTransactionBodyReservedField,
    delegatorPrivateKey,
    encodedDelegatedUnsignedExpected,
    encodedSignedExpected,
    encodedUnsignedExpected,
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
        /**
         * Decode a transaction not delegated
         */
        test('Should be able to decode a transaction - NOT DELEGATED', () => {
            const decodedUnsigned = TransactionHandler.decode(
                encodedUnsignedExpected,
                false
            );
            expect(decodedUnsigned.body).toEqual(correctTransactionBody);
            expect(decodedUnsigned.signature).toBeUndefined();
            expect(() => decodedUnsigned.origin).toThrow(
                ERRORS.TRANSACTION.NOT_SIGNED
            );
            expect(() => decodedUnsigned.delegator).toThrow(
                ERRORS.TRANSACTION.NOT_DELEGATED
            );
            expect(decodedUnsigned.isDelegated).toBe(false);
            expect(() => decodedUnsigned.id).toThrow(
                ERRORS.TRANSACTION.NOT_SIGNED
            );
            expect(decodedUnsigned.isSigned).toBe(false);
            expect(decodedUnsigned.getSignatureHash()).toBeDefined();
            expect(decodedUnsigned.getSignatureHash().length).toBe(32);
            expect(decodedUnsigned.encoded).toBeDefined();
            expect(decodedUnsigned.encoded.toString('hex')).toBe(
                encodedUnsignedExpected.toString('hex')
            );
            const decodedSigned = TransactionHandler.decode(
                encodedSignedExpected,
                true
            );
            expect(decodedSigned.body).toEqual(correctTransactionBody);
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
                encodedSignedExpected.toString('hex')
            );
            expect(decodedSigned.signature?.length).toBe(SIGNATURE_LENGTH);
        });
        /**
         * Decode a transaction delegated
         */
        test('Should be able to decode a transaction - NOT DELEGATED', () => {
            const decodedUnsigned = TransactionHandler.decode(
                encodedDelegatedUnsignedExpected,
                false
            );
            expect(decodedUnsigned.body).toEqual(
                delegatedCorrectTransactionBody
            );
            expect(decodedUnsigned.signature).toBeUndefined();
            expect(() => decodedUnsigned.origin).toThrow(
                ERRORS.TRANSACTION.NOT_SIGNED
            );
            expect(() => decodedUnsigned.delegator).toThrow(
                ERRORS.TRANSACTION.NOT_SIGNED
            );
            expect(decodedUnsigned.isDelegated).toBe(true);
            expect(() => decodedUnsigned.id).toThrow(
                ERRORS.TRANSACTION.NOT_SIGNED
            );
            expect(decodedUnsigned.isSigned).toBe(false);
            expect(decodedUnsigned.getSignatureHash()).toBeDefined();
            expect(decodedUnsigned.getSignatureHash().length).toBe(32);
            expect(decodedUnsigned.encoded).toBeDefined();
            expect(decodedUnsigned.encoded.toString('hex')).toBe(
                encodedDelegatedUnsignedExpected.toString('hex')
            );
            const encodedSignedDelegated = TransactionHandler.signWithDelegator(
                new Transaction(delegatedCorrectTransactionBody),
                signerPrivateKey,
                delegatorPrivateKey
            );
            const decodedSigned = TransactionHandler.decode(
                encodedSignedDelegated.encoded,
                true
            );
            expect(decodedSigned.body).toEqual(encodedSignedDelegated.body);
            expect(decodedSigned.signature).toBeDefined();
            expect(() => decodedSigned.origin).toBeDefined();
            expect(decodedSigned.origin).toBe(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(signerPrivateKey)
                )
            );
            expect(() => decodedSigned.delegator).toBeDefined();
            expect(decodedSigned.delegator).toBe(
                address.fromPublicKey(
                    secp256k1.derivePublicKey(delegatorPrivateKey)
                )
            );
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
            expect(decodedSigned.signature?.length).toBe(SIGNATURE_LENGTH * 2);
            // Encoded correctly reserved field
            const encoded = new Transaction(
                delegatedCorrectTransactionBodyReservedField
            );
            const delegatedWithReservedFields = TransactionHandler.decode(
                encoded.encoded,
                false
            );
            expect(delegatedWithReservedFields.body.reserved).toBeDefined();
            expect(
                delegatedWithReservedFields.body.reserved?.features
            ).toBeDefined();
            expect(delegatedWithReservedFields.body.reserved?.features).toBe(1);
            expect(
                delegatedWithReservedFields.body.reserved?.unused
            ).toBeDefined();
            expect(
                delegatedWithReservedFields.body.reserved?.unused?.length
            ).toBe(2);
            expect(delegatedWithReservedFields.body.reserved).toEqual(
                delegatedWithReservedFields.body.reserved
            );

            // Not trimmed reserved field error
            const invalidDecode = Buffer.from(
                'f8560184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec28080',
                'hex'
            );
            expect(() =>
                TransactionHandler.decode(invalidDecode, false)
            ).toThrowError(
                ERRORS.TRANSACTION.INVALID_RESERVED_NOT_TRIMMED_FIELDS
            );
        });
    });
});
