import { describe, expect, test } from '@jest/globals';
import { throwError, ERROR_CODES } from '../src';
import { InvalidKeystoreError } from '../src/model/keystore';
import { InvalidRLPError } from '../src/model/rlp';

/**
 * Error handler test
 */
describe('Error handler test', () => {
    /**
     * Verify that the error without additional data thrown is an instance of the expected error InvalidKeystoreError
     */
    test('Throw Invalid Keystore Exception without data', () => {
        expect(() =>
            throwError(
                ERROR_CODES.KEYSTORE.INVALID_KEYSTORE,
                'Invalid Keystore'
            )
        ).toThrowError(InvalidKeystoreError);
    });
    /**
     * Verify that the error with additional data thrown is an instance of the expected error InvalidKeystoreError
     */
    test('Throw Invalid Keystore Exception with data', () => {
        try {
            throwError(
                ERROR_CODES.KEYSTORE.INVALID_KEYSTORE,
                'Invalid Keystore',
                { test: 'test' }
            );
        } catch (error) {
            const invalidKeystoreError = error as InvalidKeystoreError;
            expect(invalidKeystoreError.data).toBeDefined();
        }
    });
    /**
     * Verify that the error with additional data thrown is an instance of the expected error InvalidRLPError and
     * that the additional data has the expected fields
     */
    test('Throw Invalid RLP Exception with data', () => {
        try {
            throwError(ERROR_CODES.RLP.INVALID_RLP, 'Invalid Keystore', {
                context: 'test'
            });
        } catch (error) {
            const InvalidRLPErrorObject = error as InvalidRLPError;
            expect(InvalidRLPErrorObject.data?.context).toBeDefined();
            expect(InvalidRLPErrorObject).toBeInstanceOf(InvalidRLPError);
        }
    });
});
