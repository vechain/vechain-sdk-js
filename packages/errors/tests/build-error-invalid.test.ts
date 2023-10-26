import { describe, expect, test } from '@jest/globals';
import { buildError, ERROR_CODES } from '../src';

describe('Build error function errors', () => {
    /**
     * Error on build error function
     */
    test('Invalid build error', () => {
        expect(() => {
            // @ts-expect-error Testing invalid error code
            buildError(ERROR_CODES.UNDEFINED, 'INVALID');
        }).toThrowError('Invalid error code');
    });
});
