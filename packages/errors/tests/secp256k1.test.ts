import { describe, expect, test } from '@jest/globals';
import {
    buildError,
    ERROR_CODES,
    InvalidMessageHashError,
    InvalidPrivateKeyError,
    InvalidSignatureError,
    InvalidSignatureRecoveryError
} from '../src';

/**
 * SECP256K1 errors
 */
describe('SECP256K1 errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidMessageHashError
     */
    test('Check that the constructed error is an instance of InvalidMessageHashError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_MESSAGE_HASH,
                'Invalid Message Hash'
            )
        ).toBeInstanceOf(InvalidMessageHashError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidPrivateKeyError
     */
    test('Check that the constructed error is an instance of InvalidPrivateKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_PRIVATE_KEY,
                'Invalid Private Key'
            )
        ).toBeInstanceOf(InvalidPrivateKeyError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidSignatureError
     */
    test('Check that the constructed error is an instance of InvalidSignatureError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_SIGNATURE,
                'Invalid Signature'
            )
        ).toBeInstanceOf(InvalidSignatureError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidSignatureRecoveryError
     */
    test('Check that the constructed error is an instance of InvalidSignatureRecoveryError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_SIGNATURE_RECOVERY,
                'Invalid Signature Recovery'
            )
        ).toBeInstanceOf(InvalidSignatureRecoveryError);
    });
});
