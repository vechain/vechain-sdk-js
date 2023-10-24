import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import { InvalidAddressError, InvalidChecksumError } from '../src';

describe('Address errors', () => {
    test('buildInvalidAddressError', () => {
        expect(
            buildError(ERROR_CODES.ADDRESS.INVALID_ADDRESS, 'Invalid Address')
        ).toBeInstanceOf(InvalidAddressError);
    });
    test('buildInvalidChecksumError', () => {
        expect(
            buildError(ERROR_CODES.ADDRESS.INVALID_CHECKSUM, 'Invalid Checksum')
        ).toBeInstanceOf(InvalidChecksumError);
    });
});
