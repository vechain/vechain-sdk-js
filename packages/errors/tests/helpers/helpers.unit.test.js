"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Error helpers test
 * @group unit/errors/helpers/helpers
 */
(0, globals_1.describe)('Error package helpers unit tests', () => {
    /**
     * Test together the functions createErrorMessage() and stringifyData()
     */
    (0, globals_1.describe)('createErrorMessage() and stringifyData()', () => {
        /**
         * An error message is built
         */
        (0, globals_1.test)('Should be able to build an error message', () => {
            const errorMessage = (0, src_1.createErrorMessage)('simpleMethod', 'Error message', {
                data: 'test'
            }, new Error('Internal error'));
            (0, globals_1.expect)(errorMessage).toBeDefined();
        });
        /**
         * An error message is built with inner error undefined
         */
        (0, globals_1.test)('Should be able to build an error message - inner error undefined', () => {
            const errorMessage = (0, src_1.createErrorMessage)('simpleMethod', 'Error message', {
                data: 'test'
            });
            (0, globals_1.expect)(errorMessage).toBeDefined();
        });
        /**
         * An error message is built with circular dependency on data
         */
        (0, globals_1.test)('Should be able to build an error message - circular dependency', () => {
            // Simple circular dependency object
            const circularDependencyObject = {
                prop1: 'value1',
                prop2: {
                    prop3: 'value3'
                }
            };
            // Introduce circular reference
            circularDependencyObject.prop2.prop4 = circularDependencyObject;
            const errorMessage = (0, src_1.createErrorMessage)('simpleMethod', 'Error message', {
                params: [-1],
                data: circularDependencyObject
            }, new Error('Internal error'));
            (0, globals_1.expect)(errorMessage).toBeDefined();
        });
        /**
         * An error message is built with big int data
         */
        (0, globals_1.test)('Should be able to build an error message - bigint', () => {
            const errorMessage = (0, src_1.createErrorMessage)('simpleMethod', 'Error message', {
                data: 10n
            });
            (0, globals_1.expect)(errorMessage).toBeDefined();
            (0, globals_1.expect)(errorMessage).toContain('10n');
        });
    });
    /**
     * Test assertInnerError() function
     */
    (0, globals_1.describe)('assertInnerError()', () => {
        /**
         * An error is asserted
         */
        (0, globals_1.test)('Should be able to assert an error', () => {
            const error = new Error('Test error');
            const assertedError = (0, src_1.assertInnerError)(error);
            (0, globals_1.expect)(assertedError).toBe(error);
        });
        /**
         * An error is not an instance of Error
         */
        (0, globals_1.test)('Should be able to assert an error - not an instance of Error', () => {
            const error = { message: 'Test error' };
            const assertedError = (0, src_1.assertInnerError)(error);
            (0, globals_1.expect)(assertedError).toBeInstanceOf(Error);
        });
    });
});
