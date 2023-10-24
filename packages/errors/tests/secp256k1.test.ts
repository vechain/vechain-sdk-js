import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import {
    InvalidMessageHashError,
    InvalidPrivateKeyError,
    InvalidSignatureError,
    InvalidSignatureRecoveryError
} from '../src';

describe('SECP256K1 errors', () => {
    test('buildInvalidMessageHashError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_MESSAGE_HASH,
                'Invalid Message Hash'
            )
        ).toBeInstanceOf(InvalidMessageHashError);
    });
    test('buildInvalidPrivateKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_PRIVATE_KEY,
                'Invalid Private Key'
            )
        ).toBeInstanceOf(InvalidPrivateKeyError);
    });
    test('buildInvalidSignatureError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_SIGNATURE,
                'Invalid Signature'
            )
        ).toBeInstanceOf(InvalidSignatureError);
    });
    test('buildInvalidSignatureRecoveryError', () => {
        expect(
            buildError(
                ERROR_CODES.SECP256K1.INVALID_SIGNATURE_RECOVERY,
                'Invalid Signature Recovery'
            )
        ).toBeInstanceOf(InvalidSignatureRecoveryError);
    });
});
