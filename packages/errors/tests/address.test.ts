import { describe, expect, test } from '@jest/globals';
import { buildError, InvalidAddressError, ERROR_CODES } from '../src';

/**
 * Address errors
 */
describe('Address errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidAddressError
     */
    test('Check that the constructed error is an instance of InvalidAddressError', () => {
        expect(
            buildError(ERROR_CODES.ADDRESS.INVALID_ADDRESS, 'Invalid Address')
        ).toBeInstanceOf(InvalidAddressError);
    });
});
