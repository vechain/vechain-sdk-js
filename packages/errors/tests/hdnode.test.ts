import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import {
    InvalidChaincodeError,
    InvalidMnemonicsError,
    InvalidPublicKeyError
} from '../src/model/hdnode';
import { InvalidPrivateKeyError } from '../src';

/**
 * HD node errors
 */
describe('HD node errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidChaincodeError
     */
    test('Check that the constructed error is an instance of InvalidChaincodeError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_CHAINCODE,
                'Invalid Chaincode'
            )
        ).toBeInstanceOf(InvalidChaincodeError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidMnemonicsError
     */
    test('Check that the constructed error is an instance of InvalidMnemonicsError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_MNEMONICS,
                'Invalid Mnemonics'
            )
        ).toBeInstanceOf(InvalidMnemonicsError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidPrivateKeyError
     */
    test('Check that the constructed error is an instance of InvalidPrivateKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_PRIVATEKEY,
                'Invalid Private Key'
            )
        ).toBeInstanceOf(InvalidPrivateKeyError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidPublicKeyError
     */
    test('Check that the constructed error is an instance of InvalidPublicKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_PUBLICKEY,
                'Invalid Public Key'
            )
        ).toBeInstanceOf(InvalidPublicKeyError);
    });
});
