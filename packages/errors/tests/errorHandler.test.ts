import { describe, expect, test } from '@jest/globals';
import { throwError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import { InvalidKeystoreError } from '../src/model/keystore';
import { InvalidRLPError } from '../src/model/rlp';

describe('Error handler test', () => {
    test('Throw Invalid Keystore Exception without data', () => {
        expect(() =>
            throwError(
                ERROR_CODES.KEYSTORE.INVALID_KEYSTORE,
                'Invalid Keystore'
            )
        ).toThrowError(InvalidKeystoreError);
    });
    test('Throw Invalid Keystore Exception with data', () => {
        try {
            throwError(
                ERROR_CODES.KEYSTORE.INVALID_KEYSTORE,
                'Invalid Keystore',
                { test: 'test' }
            );
        } catch (error) {
            const invalidKeystoreError = error as InvalidKeystoreError;
            expect(invalidKeystoreError.data).toBeDefined();
        }
    });
    test('Throw Invalid RLP Exception with data', () => {
        try {
            throwError(ERROR_CODES.RLP.INVALID_RLP, 'Invalid Keystore', {
                context: 'test'
            });
        } catch (error) {
            const InvalidRLPErrorObject = error as InvalidRLPError;
            expect(InvalidRLPErrorObject.data?.context).toBeDefined();
            expect(InvalidRLPErrorObject).toBeInstanceOf(InvalidRLPError);
        }
    });
});
