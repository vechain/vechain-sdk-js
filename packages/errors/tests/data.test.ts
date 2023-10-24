import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import { InvalidDataTypeError } from '../src/model/data';

describe('Data errors', () => {
    test('buildInvalidDataTypeError', () => {
        expect(
            buildError(
                ERROR_CODES.DATA.INVALID_DATA_TYPE,
                'Invalid Data Type Error'
            )
        ).toBeInstanceOf(InvalidDataTypeError);
    });
});
