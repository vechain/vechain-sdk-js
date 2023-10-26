import { describe, expect, test } from '@jest/globals';
import {
    buildError,
    ERROR_CODES,
    InvalidSecp256k1MessageHashError,
    InvalidSecp256k1PrivateKeyError,
    InvalidSecp256k1SignatureError,
    InvalidSecp256k1SignatureRecoveryError
} from '../src';

/**
 * SECP256K1 errors
 */
describe('SECP256K1 errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidMessageHashError
     */
    test('Check that the constructed error is an instance of InvalidSecp256k1MessageHashError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_SECP256k1_MESSAGE_HASH,
                'Invalid Message Hash'
            )
        ).toBeInstanceOf(InvalidSecp256k1MessageHashError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidPrivateKeyError
     */
    test('Check that the constructed error is an instance of InvalidSecp256k1PrivateKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
                'Invalid Private Key'
            )
        ).toBeInstanceOf(InvalidSecp256k1PrivateKeyError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidSignatureError
     */
    test('Check that the constructed error is an instance of InvalidSecp256k1SignatureError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_SECP256k1_SIGNATURE,
                'Invalid Signature'
            )
        ).toBeInstanceOf(InvalidSecp256k1SignatureError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidSignatureRecoveryError
     */
    test('Check that the constructed error is an instance of InvalidSecp256k1SignatureRecoveryError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY,
                'Invalid Signature Recovery'
            )
        ).toBeInstanceOf(InvalidSecp256k1SignatureRecoveryError);
    });
});
