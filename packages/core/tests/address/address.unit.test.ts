import { InvalidAddressError } from '@vechain/sdk-errors';
import { addressUtils } from '../../src';
import { describe, expect, test } from '@jest/globals';
import {
    checksummedAndUnchecksummedAddressesFixture,
    simpleAddressFixture,
    simplePrivateKeyFixture,
    simpleUncompressedPublicKeyFixture
} from './fixture';

/**
 * Tests for address module
 *
 * @group sdk-core/unit/address
 */
describe('addressUtils', () => {
    /**
     * Derivation of address from private key AND public key
     */
    describe('Address Derivation', () => {
        /**
         * Derive address from a private key positive test case
         */
        test('fromPrivateKey', () => {
            expect(
                addressUtils.fromPrivateKey(simplePrivateKeyFixture)
            ).toEqual(simpleAddressFixture);
        });

        /**
         * Derive address from a public key positive test case
         */
        test('fromPublicKey', () => {
            expect(
                addressUtils.fromPublicKey(simpleUncompressedPublicKeyFixture)
            ).toEqual(simpleAddressFixture);
        });
    });

    describe('Check if is address', () => {
        /**
         * Is address case of not hex string
         */
        test('isAddress - false - not hex', () => {
            expect(addressUtils.isAddress('not an address')).toEqual(false);
        });

        /**
         * Is address case of no 0x prefix
         */
        test('isAddress - false - no 0x prefix', () => {
            expect(
                addressUtils.isAddress(
                    '52908400098527886E0F7030069857D2E4169EE7'
                )
            ).toEqual(false);
        });

        /**
         * Is address correct address
         */
        test('isAddress - true', () => {
            expect(
                addressUtils.isAddress(
                    '0x52908400098527886E0F7030069857D2E4169EE7'
                )
            ).toEqual(true);
        });
    });

    /**
     * Test address ERC55 checksum
     */
    describe('Address ERC55 Checksum', () => {
        /**
         * Invalid inputs, not hex string
         */
        test('toERC55Checksum - invalid - no hex', () => {
            expect(() => {
                addressUtils.toERC55Checksum('invalid data');
            }).toThrowError(InvalidAddressError);
        });

        /**
         * Invalid inputs, no 0x prefix
         */
        test('toERC55Checksum - invalid - no 0x prefix', () => {
            expect(() => {
                addressUtils.toERC55Checksum(
                    '52908400098527886E0F7030069857D2E4169EE7'
                );
            }).toThrowError(InvalidAddressError);
        });

        /**
         * Invalid inputs, wrong size address
         */
        test('toERC55Checksum - invalid - wrong size', () => {
            expect(() => {
                addressUtils.toERC55Checksum(
                    '0x52908400098527886E0F7030069857D9EE7'
                );
            }).toThrowError(InvalidAddressError);
        });

        /**
         * Valid inputs, checksummed address
         */
        test('toERC55Checksum - valid', () => {
            checksummedAndUnchecksummedAddressesFixture.forEach(
                (addressPair) => {
                    expect(
                        addressUtils.toERC55Checksum(addressPair.unchecksummed)
                    ).toEqual(addressPair.checksummed);
                }
            );
        });
    });
});
