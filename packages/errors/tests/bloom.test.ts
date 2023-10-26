import { describe, expect, test } from '@jest/globals';
import {
    buildError,
    ERROR_CODES,
    InvalidBloomError,
    InvalidKError
} from '../src';

/**
 * Bloom errors
 */
describe('Bloom errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidBloomError
     */
    test('Check that the constructed error is an instance of InvalidBloomError', () => {
        expect(
            buildError(ERROR_CODES.BLOOM.INVALID_BLOOM, 'Invalid Bloom')
        ).toBeInstanceOf(InvalidBloomError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidKError
     */
    test('Check that the constructed error is an instance of InvalidKError', () => {
        expect(
            buildError(ERROR_CODES.BLOOM.INVALID_K, 'Invalid K')
        ).toBeInstanceOf(InvalidKError);
    });
});
