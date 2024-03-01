import { describe, expect, test } from '@jest/globals';
import { buildErrorMessage } from '../../../src/utils/error-message-builder';

/**
 * Error message buildr test
 * @group unit/errors/error-message-builder
 */
describe('Error message builder test', () => {
    /**
     * An error message is built
     */
    test('Should be able to build an error message', () => {
        const errorMessage = buildErrorMessage(
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
        const errorMessage = buildErrorMessage(
            'simpleMethod',
            'Error message',
            {
                data: 'test'
            }
        );
        expect(errorMessage).toBeDefined();
    });
});
