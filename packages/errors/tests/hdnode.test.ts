import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import {
    InvalidChaincodeError,
    InvalidMnemonicsError,
    InvalidPublicKeyError
} from '../src/model/hdnode';
import { InvalidPrivateKeyError } from '../src';

describe('HD node errors', () => {
    test('buildInvalidChaincodeError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_CHAINCODE,
                'Invalid Chaincode'
            )
        ).toBeInstanceOf(InvalidChaincodeError);
    });
    test('buildInvalidMnemonicsError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_MNEMONICS,
                'Invalid Mnemonics'
            )
        ).toBeInstanceOf(InvalidMnemonicsError);
    });
    test('buildInvalidPrivateKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_PRIVATEKEY,
                'Invalid Private Key'
            )
        ).toBeInstanceOf(InvalidPrivateKeyError);
    });
    test('buildInvalidPublicKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_PUBLICKEY,
                'Invalid Public Key'
            )
        ).toBeInstanceOf(InvalidPublicKeyError);
    });
});
