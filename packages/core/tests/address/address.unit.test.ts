import { describe, expect, test } from '@jest/globals';
import { addressUtils, secp256k1 } from '../../src';
import {
    checksummedAndUnchecksummedAddresses,
    invalidPrivateKey,
    simpleAddress,
    simplePrivateKey,
    simpleUncompressedPublicKey
} from './fixture';
import {
    InvalidAddressError,
    InvalidSecp256k1PrivateKeyError
} from '@vechain/sdk-errors';

/**
 * Test address module
 * @group unit/address
 */
describe('addressUtils', () => {
    test('fromPrivateKey', () => {
        expect(addressUtils.fromPrivateKey(simplePrivateKey)).toEqual(
            simpleAddress
        );
    });

    describe('fromPublicKey', () => {
        test('private -> public key relation - invalid', () => {
            expect(() =>
                secp256k1.derivePublicKey(invalidPrivateKey)
            ).toThrowError(InvalidSecp256k1PrivateKeyError);
        });

        test('private -> public key relation - valid', () => {
            expect(
                secp256k1.inflatePublicKey(
                    secp256k1.derivePublicKey(simplePrivateKey)
                )
            ).toEqual(simpleUncompressedPublicKey);
        });

        test('public key -> address relation', () => {
            expect(
                addressUtils.fromPublicKey(simpleUncompressedPublicKey)
            ).toEqual(simpleAddress);
        });
    });

    describe('isAddress', () => {
        test('isAddress - false - not hex', () => {
            expect(addressUtils.isAddress('not an address')).toEqual(false);
        });

        test('isAddress - false - no 0x prefix', () => {
            expect(
                addressUtils.isAddress(
                    '52908400098527886E0F7030069857D2E4169EE7'
                )
            ).toEqual(false);
        });

        test('isAddress - true', () => {
            expect(
                addressUtils.isAddress(
                    '0x52908400098527886E0F7030069857D2E4169EE7'
                )
            ).toEqual(true);
        });
    });

    /**
     * Test address checksum
     */
    describe('Checksum', () => {
        /**
         * Invalid inputs
         */
        test('invalid input should throw error', () => {
            expect(() => {
                addressUtils.toChecksummed('invalid data');
            }).toThrowError(InvalidAddressError);
            expect(() => {
                addressUtils.toChecksummed(
                    '52908400098527886E0F7030069857D2E4169EE7'
                );
            }).toThrowError(InvalidAddressError);

            expect(() => {
                addressUtils.toChecksummed(
                    '52908400098527886E0F7030069857D9EE7'
                );
            }).toThrowError(InvalidAddressError);
        });

        /**
         * Valid inputs
         */
        test('valid input', () => {
            checksummedAndUnchecksummedAddresses.forEach((addressPair) => {
                expect(
                    addressUtils.toChecksummed(addressPair.unchecksummed)
                ).toEqual(addressPair.checksummed);
            });
        });
    });
});
