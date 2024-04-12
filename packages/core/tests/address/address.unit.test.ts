import { describe, expect, test } from '@jest/globals';
import { addressUtils, secp256k1 } from '../../src';
import {
    checksummedAndUnchecksummedAddresses,
    invalidPrivateKey,
    simpleAddress,
    simplePrivateKey,
    simplePublicKey
} from './fixture';
import {
    InvalidAddressError,
    InvalidSecp256k1PrivateKeyError
} from '@vechain/sdk-errors';

/**
 * Test address module
 * @group unit/address
 */
describe('Address', () => {
    /**
     * Address validity
     */
    describe('Address validity', () => {
        /**
         * Valid and invalid address check
         */
        test('validate address', () => {
            expect(addressUtils.isAddress('not an address')).toEqual(false);
            expect(
                addressUtils.isAddress(
                    '52908400098527886E0F7030069857D2E4169EE7'
                )
            ).toEqual(false);
            expect(
                addressUtils.isAddress(
                    '0x52908400098527886E0F7030069857D2E4169EE7'
                )
            ).toEqual(true);
        });
    });

    /**
     * Test derivation of public key from private key
     */
    describe('Derivation ', () => {
        /**
         * Derive public key from private key using secp256k1
         */
        test('derive public key from private key', () => {
            // Correct private key / public key / address derivation
            expect(
                Buffer.from(
                    secp256k1.inflatePublicKey(
                        secp256k1.derivePublicKey(simplePrivateKey)
                    )
                )
            ).toEqual(simplePublicKey);
            expect(addressUtils.fromPublicKey(simplePublicKey)).toEqual(
                simpleAddress
            );

            // Invalid private key to derive public key
            expect(() =>
                secp256k1.derivePublicKey(invalidPrivateKey)
            ).toThrowError(InvalidSecp256k1PrivateKeyError);
        });

        /**
         * Derive the address from the private key
         */
        test('derive address from private key', () => {
            // Correct private key address derivation
            expect(addressUtils.fromPrivateKey(simplePrivateKey)).toEqual(
                simpleAddress
            );
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
