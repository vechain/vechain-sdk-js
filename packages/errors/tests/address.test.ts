import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import { InvalidAddressError } from '../src';

describe('Address errors', () => {
    test('buildInvalidAddressError', () => {
        expect(
            buildError(ERROR_CODES.ADDRESS.INVALID_ADDRESS, 'test', {})
        ).toBeInstanceOf(InvalidAddressError);
    });
});
