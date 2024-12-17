import { describe, expect, test } from '@jest/globals';
import { assertInnerError, createErrorMessage } from '../../src';

/**
 * Error helpers test
 * @group unit/errors/helpers/helpers
 */
describe('Error package helpers unit tests', () => {
    /**
     * Test together the functions createErrorMessage() and stringifyData()
     */
    describe('createErrorMessage() and stringifyData()', () => {
        /**
         * An error message is built
         */
        test('Should be able to build an error message', () => {
            const errorMessage = createErrorMessage(
                'simpleMethod',
                'Error message',
                {
                    data: 'test'
                },
                new Error('Internal error')
            );
            expect(errorMessage).toBeDefined();
        });

        /**
         * An error message is built with inner error undefined
         */
        test('Should be able to build an error message - inner error undefined', () => {
            const errorMessage = createErrorMessage(
                'simpleMethod',
                'Error message',
                {
                    data: 'test'
                }
            );
            expect(errorMessage).toBeDefined();
        });

        /**
         * An error message is built with circular dependency on data
         */
        test('Should be able to build an error message - circular dependency', () => {
            // Simple circular dependency object
            const circularDependencyObject: {
                prop1: string;
                prop2: {
                    prop3: string;
                    prop4?: unknown;
                };
            } = {
                prop1: 'value1',
                prop2: {
                    prop3: 'value3'
                }
            };

            // Introduce circular reference
            circularDependencyObject.prop2.prop4 = circularDependencyObject;

            const errorMessage = createErrorMessage(
                'simpleMethod',
                'Error message',
                {
                    params: [-1],
                    data: circularDependencyObject
                },
                new Error('Internal error')
            );
            expect(errorMessage).toBeDefined();
        });

        /**
         * An error message is built with big int data
         */
        test('Should be able to build an error message - bigint', () => {
            const errorMessage = createErrorMessage(
                'simpleMethod',
                'Error message',
                {
                    data: 10n
                }
            );
            expect(errorMessage).toBeDefined();
            expect(errorMessage).toContain('10n');
        });
    });

    /**
     * Test assertInnerError() function
     */
    describe('assertInnerError()', () => {
        /**
         * An error is asserted
         */
        test('Should be able to assert an error', () => {
            const error = new Error('Test error');
            const assertedError = assertInnerError(error);
            expect(assertedError).toBe(error);
        });

        /**
         * An error is not an instance of Error
         */
        test('Should be able to assert an error - not an instance of Error', () => {
            const error = { message: 'Test error' };
            const assertedError = assertInnerError(error);
            expect(assertedError).toBeInstanceOf(Error);
        });
    });
});
