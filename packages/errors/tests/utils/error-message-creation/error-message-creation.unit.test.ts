import { describe, expect, test } from '@jest/globals';
import { createErrorMessage } from '../../../src';

/**
 * Error message builder test
 * @group unit/errors/error-message-creation
 */
describe('Error message builder test', () => {
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
     * NEW Error builder function
     *
     * ----- START: TEMPORARY COMMENT -----
     * Remove previous tests when the new function is implemented
     * ----- END: TEMPORARY COMMENT -----
     */
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
});
