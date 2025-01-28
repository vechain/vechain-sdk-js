import { describe, expect, test } from '@jest/globals';
import { hexToBytes } from '@noble/ciphers/utils';
import { InvalidDataType } from '@vechain/sdk-errors';
import { Address } from '../../src';

/**
 * Test Address class.
 * @group unit/vcdm
 */
describe('Address class tests', () => {
    describe('Construction tests', () => {
        test('ok <-  valid lowercase', () => {
            const exp = '0xcfb79a9c950b78e14c43efa621ebcf9660dbe01f';
            const address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
        });

        test('ok <-  valid checksum format', () => {
            const exp = '0xCfb79a9c950b78E14c43efa621ebcf9660dbe01F';
            const address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
        });

        test('ok <-  valid uppercase', () => {
            const exp = '0xCFB79A9C950B78E14C43EFA621EBCF9660DBE01F';
            const address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
        });

        test('ok <- valid from shorter expression', () => {
            const exp = '0xcaffee';
            const address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
            expect(address.toString().length).toBe(Address.DIGITS + 2);
        });

        test('error <- invalid', () => {
            const exp = '-0xcaffee';
            expect(() => Address.of(exp)).toThrow(InvalidDataType);
        });
    });

    describe('ofPrivateKey', () => {
        test('ok <- private key', () => {
            const privateKey = hexToBytes(
                '5434c159b817c377a55f6be66369622976014e78bce2adfd3e44e5de88ce502f'
            );
            const address = Address.ofPrivateKey(privateKey);
            expect(address.toString()).toBe(
                '0x769E8AA372c8309c834EA6749B88861FF73581FF'
            );
        });

        test('error <- invalid', () => {
            const privateKey = new Uint8Array([1, 2, 3, 4, 5]);
            expect(() => Address.ofPrivateKey(privateKey)).toThrow(
                InvalidDataType
            );
        });
    });
    describe('ofPublicKey', () => {
        test('ok <- valid', () => {
            const publicKey = hexToBytes(
                '04a6711e14234b1d4e69aeed2acf18b9c3bd0e97db317b509516bd3a87e5b732685ccaf855d9f8a955bc1f420b4ebf8f682c2e480d98a360e7fd0c08e6eef65607'
            );
            const address = Address.ofPublicKey(publicKey);
            expect(address.toString()).toBe(
                '0x769E8AA372c8309c834EA6749B88861FF73581FF'
            );
        });

        test('error <- invalid', () => {
            const publicKey = new Uint8Array([1, 2, 3, 4, 5]);
            expect(() => Address.ofPublicKey(publicKey)).toThrow(
                InvalidDataType
            );
        });
    });
});
