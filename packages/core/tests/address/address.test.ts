import { describe, expect, test } from '@jest/globals';
import { ERRORS, address, secp256k1 } from '../../src';
import {
    checksumedAndUnchecksumedAddresses,
    invalidPrivateKey,
    simpleAddress,
    simplePrivateKey,
    simplePublicKey
} from './fixture';

/**
 * Test address module
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
            expect(address.isAddress('not an address')).toEqual(false);
            expect(
                address.isAddress('52908400098527886E0F7030069857D2E4169EE7')
            ).toEqual(false);
            expect(
                address.isAddress('0x52908400098527886E0F7030069857D2E4169EE7')
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
            expect(secp256k1.derivePublicKey(simplePrivateKey)).toEqual(
                simplePublicKey
            );
            expect(address.fromPublicKey(simplePublicKey)).toEqual(
                simpleAddress
            );

            // Invalid private key to derive public key
            expect(() => secp256k1.derivePublicKey(invalidPrivateKey)).toThrow(
                ERRORS.SECP256K1.INVALID_PRIVATE_KEY
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
                address.toChecksumed('invalid data');
            }).toThrow(ERRORS.ADDRESS.INVALID_ADDRESS);
            expect(() => {
                address.toChecksumed(
                    '52908400098527886E0F7030069857D2E4169EE7'
                );
            }).toThrow(ERRORS.ADDRESS.INVALID_ADDRESS);
        });

        /**
         * Valid inputs
         */
        test('valid input', () => {
            checksumedAndUnchecksumedAddresses.forEach((addressPair) => {
                expect(address.toChecksumed(addressPair.unchecksumed)).toEqual(
                    addressPair.checksumed
                );
            });
        });
    });
});
