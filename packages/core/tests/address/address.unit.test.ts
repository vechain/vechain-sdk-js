import { InvalidAddressError } from '@vechain/sdk-errors';
import { addressUtils } from '../../src';
import { describe, expect, test } from '@jest/globals';
import {
    checksummedAndUnchecksummedAddresses,
    simpleAddress,
    simplePrivateKey,
    simpleUncompressedPublicKey
} from './fixture';

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
    describe('toERC55Checksum', () => {
        /**
         * Invalid inputs
         */
        test('toERC55Checksum - invalid - no hex', () => {
            expect(() => {
                addressUtils.toERC55Checksum('invalid data');
            }).toThrowError(InvalidAddressError);
        });

        test('toERC55Checksum - invalid - no 0x prefix', () => {
            expect(() => {
                addressUtils.toERC55Checksum(
                    '52908400098527886E0F7030069857D2E4169EE7'
                );
            }).toThrowError(InvalidAddressError);
        });

        test('toERC55Checksum - invalid - wrong size', () => {
            expect(() => {
                addressUtils.toERC55Checksum(
                    '0x52908400098527886E0F7030069857D9EE7'
                );
            }).toThrowError(InvalidAddressError);
        });

        test('toERC55Checksum - valid', () => {
            checksummedAndUnchecksummedAddresses.forEach((addressPair) => {
                expect(
                    addressUtils.toERC55Checksum(addressPair.unchecksummed)
                ).toEqual(addressPair.checksummed);
            });
        });
    });
});
