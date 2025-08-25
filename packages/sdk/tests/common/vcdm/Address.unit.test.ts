import { Address } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import { describe, expect, test } from '@jest/globals';
import { fail } from 'assert';
import { hexToBytes } from '@noble/ciphers/utils';

/**
 * Test Address class.
 * @group unit/vcdm
 */
describe('Address class tests', () => {
    describe('Construction tests', () => {
        test('Return an Address instance if the passed argument is valid', () => {
            let exp = '0xcfb79a9c950b78e14c43efa621ebcf9660dbe01f';
            let address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
            exp = '0xCfb79a9c950b78E14c43efa621ebcf9660dbe01F';
            address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
            exp = '0xCFB79A9C950B78E14C43EFA621EBCF9660DBE01F';
            address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
            exp = '0xcaffee';
            address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
            expect(address.toString().length).toBe(Address.DIGITS + 2);
        });

        test('Throw an error if the passed argument is an invalid address', () => {
            const exp = '-0xcaffee';
            try {
                Address.of(exp);
                fail('This should have thrown an error');
            } catch (e) {
                expect(e).toBeInstanceOf(IllegalArgumentError);
            }
        });
    });

    describe('Key tests', () => {
        test('Should get the address from a given private key', () => {
            const privateKey = hexToBytes(
                '5434c159b817c377a55f6be66369622976014e78bce2adfd3e44e5de88ce502f'
            );
            const address = Address.ofPrivateKey(privateKey);
            expect(address.toString()).toBe(
                '0x769E8AA372c8309c834EA6749B88861FF73581FF'
            );
        });

        test('Should throw an invalid data type error if the private key is invalid', () => {
            const privateKey = new Uint8Array([1, 2, 3, 4, 5]);
            try {
                Address.ofPrivateKey(privateKey);
                fail('This should have thrown an error');
            } catch (e) {
                expect(e).toBeInstanceOf(IllegalArgumentError);
            }
        });

        test('Should get the address from a given public key', () => {
            const publicKey = hexToBytes(
                '04a6711e14234b1d4e69aeed2acf18b9c3bd0e97db317b509516bd3a87e5b732685ccaf855d9f8a955bc1f420b4ebf8f682c2e480d98a360e7fd0c08e6eef65607'
            );
            const address = Address.ofPublicKey(publicKey);
            expect(address.toString()).toBe(
                '0x769E8AA372c8309c834EA6749B88861FF73581FF'
            );
        });

        test('Should throw an invalid data type error if the public key is invalid', () => {
            const publicKey = new Uint8Array([1, 2, 3, 4, 5]);
            try {
                Address.ofPublicKey(publicKey);
                fail('This should have thrown an error');
            } catch (e) {
                expect(e).toBeInstanceOf(IllegalArgumentError);
            }
        });
    });
});
