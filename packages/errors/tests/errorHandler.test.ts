import { describe, expect, test } from '@jest/globals';
import {
    ERROR_CODES,
    buildError,
    InvalidKeystoreError,
    InvalidRLPError,
    assertInnerError,
    buildProviderError,
    ProviderRpcError
} from '../src';
import {
    ErrorsCodeAndClassesMapsFixture,
    JSONrpcErrorsCodeAndClassesMapsFixture
} from './fixture';

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
                'Invalid Keystore: Missing or malformed data'
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
                'Invalid Keystore: Missing or malformed data',
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
            throw buildError(
                ERROR_CODES.RLP.INVALID_RLP,
                'Invalid Keystore: Missing or malformed data',
                {
                    context: 'test'
                }
            );
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
     * Verify that the inner error is undefined when not provided
     */
    test('Verify that the inner error is undefined', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.CONTRACT_INTERFACE_ERROR,
                'test',
                undefined,
                undefined
            ).innerError
        ).toBeUndefined();
    });

    /**
     * Verify that the inner error is defined when provided
     */
    test('Verify that the inner error is defined', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.CONTRACT_INTERFACE_ERROR,
                'test',
                undefined,
                new Error('test')
            ).innerError
        ).toBeDefined();
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

    /**
     * Verify all JSON RPC/Provider error codes and classes
     */
    JSONrpcErrorsCodeAndClassesMapsFixture.forEach((errorType) => {
        /**
         * Test for each model
         */
        test(`Verify all error codes and classes for ${errorType.name}`, () => {
            /**
             * Each error code and class
             */
            errorType.elements.forEach((element) => {
                expect(
                    buildProviderError(element.errorCode, 'SOME_MESSAGE')
                ).toBeInstanceOf(ProviderRpcError);
            });
        });
    });

    /**
     * Verify that the error code is valid
     */
    test('Should throw error for invalid JSON RPC error code', () => {
        expect(() => {
            // @ts-expect-error Should throw error for invalid JSON RPC error code
            buildProviderError(0, 'SOME_MESSAGE');
        }).toThrowError('Invalid error code');
    });
});
