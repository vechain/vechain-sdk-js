import { describe, expect, test } from '@jest/globals';
import { ERRORS } from '../../../src';

/**
 * Data errors
 * @group unit/utils-errors
 */
describe('Data Errors', () => {
    /**
     * Data format
     */
    test('Should generate an error message indicating an invalid data type', () => {
        expect(ERRORS.DATA.INVALID_DATA_TYPE('a hexadecimal string')).toBe(
            'Invalid data type. Data should be a hexadecimal string.'
        );
    });

    /**
     * Dynamic error messages
     */
    test('Should generate dynamic error messages based on the provided format', () => {
        expect(ERRORS.DATA.INVALID_DATA_TYPE('a positive integer')).toBe(
            'Invalid data type. Data should be a positive integer.'
        );
    });
});
