import { describe, expect, test } from '@jest/globals';
import { hexToBytes } from '@noble/ciphers/utils';
import {
    InvalidDataType,
    InvalidSecp256k1PrivateKey
} from '@vechain/sdk-errors';
import { fail } from 'assert';
import { Address, addressUtils } from '../../src';

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
        });
        test('Throw an error if the passed argument is an invalid address', () => {
            let exp = '-0xcaffee';
            try {
                Address.of(exp);
                fail('This should have thrown an error');
            } catch (e) {
                expect(e).toBeInstanceOf(InvalidDataType);
                if (e instanceof InvalidDataType) {
                    expect(e.message).toBe(
                        `Method 'Address.of' failed.` +
                            `\n-Reason: 'not a valid hexadecimal positive integer expression'` +
                            `\n-Parameters: \n\t{\n  "exp": "-0xcaffee"\n}` +
                            `\n-Internal error: \n\tMethod 'HexUInt.of' failed.` +
                            `\n-Reason: 'not a hexadecimal positive integer expression'` +
                            `\n-Parameters: \n\t{\n  "exp": "${exp}",\n  "e": {\n    "methodName": "HexUInt.of",\n    "errorMessage": "not positive",\n    "data": {\n      "exp": "-0xcaffee"\n    }\n  }\n}` +
                            `\n-Internal error: ` +
                            `\n\tMethod 'HexUInt.of' failed.` +
                            `\n-Reason: 'not positive'` +
                            `\n-Parameters: \n\t{\n  "exp": "${exp}"\n}`
                    );
                }
            }
            exp = '0xcaffee';
            try {
                Address.of(exp);
                fail('This should have thrown an error');
            } catch (e) {
                expect(e).toBeInstanceOf(InvalidDataType);
                if (e instanceof InvalidDataType) {
                    expect(e.message).toBe(
                        `Method 'Address.of' failed.` +
                            `\n-Reason: 'not a valid hexadecimal positive integer expression'` +
                            `\n-Parameters: \n\t{\n  "exp": "0xcaffee"\n}` +
                            `\n-Internal error: \n\tMethod 'Address.of' failed.` +
                            `\n-Reason: 'not a valid address'` +
                            `\n-Parameters: \n\t{\n  "huint": {\n    "digits": "caffee",\n    "sign": 1\n  }\n}`
                    );
                }
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
                expect(e).toBeInstanceOf(InvalidSecp256k1PrivateKey);
                if (e instanceof InvalidSecp256k1PrivateKey) {
                    expect(e.message).toBe(
                        `Method 'Secp256k1.derivePublicKey' failed.` +
                            `\n-Reason: 'Invalid private key given as input. Ensure it is a valid 32-byte secp256k1 private key.'` +
                            `\n-Parameters: \n\tundefined`
                    );
                }
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
                expect(e).toBeInstanceOf(InvalidDataType);
                if (e instanceof InvalidDataType) {
                    expect(e.message).toBe(
                        `Method 'Address.ofPublicKey' failed.` +
                            `\n-Reason: 'not a valid public key'` +
                            `\n-Parameters: \n\t{\n  "publicKey": "${publicKey}"\n}` +
                            `\n-Internal error: \n\tPoint of length 5 was invalid. Expected 33 compressed bytes or 65 uncompressed bytes`
                    );
                }
            }
        });
    });
    describe('Backwards compatibility tests', () => {
        test('Should get the address from a given private key', () => {
            const privateKey = hexToBytes(
                '5434c159b817c377a55f6be66369622976014e78bce2adfd3e44e5de88ce502f'
            );
            const address = addressUtils.fromPrivateKey(privateKey);
            expect(address).toBe('0x769E8AA372c8309c834EA6749B88861FF73581FF');
        });
        test('Should get the address from a given public key', () => {
            const publicKey = hexToBytes(
                '04a6711e14234b1d4e69aeed2acf18b9c3bd0e97db317b509516bd3a87e5b732685ccaf855d9f8a955bc1f420b4ebf8f682c2e480d98a360e7fd0c08e6eef65607'
            );
            const address = addressUtils.fromPublicKey(publicKey);
            expect(address).toBe('0x769E8AA372c8309c834EA6749B88861FF73581FF');
        });
        test('Should return true if the address is a valid address', () => {
            const address = '0x769E8AA372c8309c834EA6749B88861FF73581FF';
            expect(addressUtils.isAddress(address)).toBeTruthy();
        });
        test('Should get the ERC55 checksum', () => {
            const address = '0x769e8aa372c8309c834eA6749b88861ff73581ff';
            const checksum = addressUtils.toERC55Checksum(address);
            expect(checksum).toBe('0x769E8AA372c8309c834EA6749B88861FF73581FF');
        });
    });
});
