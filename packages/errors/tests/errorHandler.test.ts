import { describe, expect, test } from '@jest/globals';
import {
    ERROR_CODES,
    buildError,
    InvalidKeystoreError,
    InvalidRLPError,
    ErrorClassMap
} from '../src';

/**
 * Error handler test
 */
describe('Error handler test', () => {
    /**
     * Verify that the error without additional data thrown is an instance of the expected error InvalidKeystoreError
     */
    test('Throw Invalid Keystore Exception without data', () => {
        expect(() => {
            throw buildError(
                ERROR_CODES.KEYSTORE.INVALID_KEYSTORE,
                'Invalid Keystore'
            );
        }).toThrowError(InvalidKeystoreError);
    });
    /**
     * Verify that the error with additional data thrown is an instance of the expected error InvalidKeystoreError
     */
    test('Throw Invalid Keystore Exception with data', () => {
        try {
            throw buildError(
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
            throw buildError(ERROR_CODES.RLP.INVALID_RLP, 'Invalid Keystore', {
                context: 'test'
            });
        } catch (error) {
            const InvalidRLPErrorObject = error as InvalidRLPError;
            expect(InvalidRLPErrorObject.data?.context).toBeDefined();
            expect(InvalidRLPErrorObject).toBeInstanceOf(InvalidRLPError);
        }
    });

    /**
     * Verify all error codes and classes
     */
    test('Verify all error codes and classes', () => {
        ErrorClassMap.forEach((errorClass, errorCode) => {
            expect(buildError(errorCode, 'test')).toBeInstanceOf(errorClass);
        });
    });
});
