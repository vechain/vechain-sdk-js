import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import { InvalidBloomError, InvalidKError } from '../src/model/bloom';

describe('Bloom errors', () => {
    test('buildInvalidBloomError', () => {
        expect(
            buildError(ERROR_CODES.BLOOM.INVALID_BLOOM, 'Invalid Bloom')
        ).toBeInstanceOf(InvalidBloomError);
    });
    test('buildInvalidKError', () => {
        expect(
            buildError(ERROR_CODES.BLOOM.INVALID_K, 'Invalid K')
        ).toBeInstanceOf(InvalidKError);
    });
});
