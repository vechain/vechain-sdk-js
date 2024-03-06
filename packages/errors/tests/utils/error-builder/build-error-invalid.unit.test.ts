import { describe, expect, test } from '@jest/globals';
import { buildError, ERROR_CODES } from '../../../src';

/**
 * Build error function errors
 * @group unit/errors/utils/build-error
 */
describe('Build error function errors', () => {
    /**
     * Error on build error function
     */
    test('Invalid build error', () => {
        expect(() => {
            // @ts-expect-error Testing invalid error code
            buildError('test', ERROR_CODES.UNDEFINED, 'INVALID');
        }).toThrowError();
    });
});
