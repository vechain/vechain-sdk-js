import { describe, expect, test } from '@jest/globals';
import { buildError, ERROR_CODES, InvalidDataTypeError } from '../src';

describe('Data errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidDataTypeError
     */
    test('Check that the constructed error is an instance of InvalidDataTypeError', () => {
        expect(
            buildError(
                ERROR_CODES.DATA.INVALID_DATA_TYPE,
                'Invalid Data Type Error'
            )
        ).toBeInstanceOf(InvalidDataTypeError);
    });
});
