import { describe, expect, test } from '@jest/globals';
import { buildError, ERROR_CODES } from '../src';
import {
    InvalidKeystoreError,
    InvalidKeystorePasswordError
} from '../src/model/keystore';

/**
 * Keystore errors
 * @group unit/errors/keystore
 */
describe('Keystore errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidKeystoreError
     */
    test('Check that the constructed error is an instance of InvalidKeystoreError', () => {
        expect(
            buildError(
                ERROR_CODES.KEYSTORE.INVALID_KEYSTORE,
                'Invalid Keystore'
            )
        ).toBeInstanceOf(InvalidKeystoreError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidKeystorePasswordError
     */
    test('Check that the constructed error is an instance of InvalidKeystorePasswordError', () => {
        expect(
            buildError(
                ERROR_CODES.KEYSTORE.INVALID_PASSWORD,
                'Invalid Password'
            )
        ).toBeInstanceOf(InvalidKeystorePasswordError);
    });
});
