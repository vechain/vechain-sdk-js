import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import { InvalidDataTypeError } from '../src/model/data';

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
