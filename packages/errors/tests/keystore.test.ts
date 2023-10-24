import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import {
    InvalidKeystoreError,
    InvalidKeystorePasswordError
} from '../src/model/keystore';

describe('Keystore errors', () => {
    test('buildInvalidKeystoreError', () => {
        expect(
            buildError(
                ERROR_CODES.KEYSTORE.INVALID_KEYSTORE,
                'Invalid Keystore'
            )
        ).toBeInstanceOf(InvalidKeystoreError);
    });
    test('buildInvalidKeystorePasswordError', () => {
        expect(
            buildError(
                ERROR_CODES.KEYSTORE.INVALID_PASSWORD,
                'Invalid Password'
            )
        ).toBeInstanceOf(InvalidKeystorePasswordError);
    });
});
