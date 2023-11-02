import { describe, expect, test } from '@jest/globals';
import {
    ERROR_CODES,
    buildError,
    InvalidKeystoreError,
    InvalidRLPError,
    assertInnerError
} from '../src';
import { ErrorsCodeAndClassesMapsFixture } from './fixture';

/**
 * Error handler test
 * @group unit/errors/error-handler
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
     * Verify that the object is an instance of error
     */
    test('Assert valid error', () => {
        expect(assertInnerError(new Error('test'))).toBeDefined();
    });

    /**
     * Verify that the object is not a valid instance of error
     */
    test('Assert invalid error', () => {
        expect(() => assertInnerError({})).toThrowError();
    });

    /**
     * Verify all error codes and classes
     */
    ErrorsCodeAndClassesMapsFixture.forEach((errorType) => {
        /**
         * Test for each model
         */
        test(`Verify all error codes and classes for ${errorType.name}`, () => {
            /**
             * Each error code and class
             */
            errorType.elements.forEach((element) => {
                expect(
                    buildError(element.errorCode, 'SOME_MESSAGE')
                ).toBeInstanceOf(element.classExpected);
            });
        });
    });
});
