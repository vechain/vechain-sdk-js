import { describe, expect, test } from '@jest/globals';
import {
    buildError,
    ERROR_CODES,
    InvalidHDNodePrivateKeyError,
    InvalidHDNodeChaincodeError,
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePublicKeyError
} from '../src';

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
                ERROR_CODES.HDNODE.INVALID_HDNODE_CHAIN_CODE,
                'Invalid Chaincode'
            )
        ).toBeInstanceOf(InvalidHDNodeChaincodeError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidMnemonicsError
     */
    test('Check that the constructed error is an instance of InvalidMnemonicsError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_HDNODE_MNEMONICS,
                'Invalid Mnemonics'
            )
        ).toBeInstanceOf(InvalidHDNodeMnemonicsError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidPrivateKeyError
     */
    test('Check that the constructed error is an instance of InvalidPrivateKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_HDNODE_PRIVATE_KEY,
                'Invalid Private Key'
            )
        ).toBeInstanceOf(InvalidHDNodePrivateKeyError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidPublicKeyError
     */
    test('Check that the constructed error is an instance of InvalidPublicKeyError', () => {
        expect(
            buildError(
                ERROR_CODES.HDNODE.INVALID_HDNODE_PUBLIC_KEY,
                'Invalid Public Key'
            )
        ).toBeInstanceOf(InvalidHDNodePublicKeyError);
    });
});
