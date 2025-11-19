"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const utils_1 = require("@noble/ciphers/utils");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
/**
 * Test Address class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('Address class tests', () => {
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('ok <-  valid lowercase', () => {
            const exp = '0xcfb79a9c950b78e14c43efa621ebcf9660dbe01f';
            const address = src_1.Address.of(exp);
            (0, globals_1.expect)(address).toBeInstanceOf(src_1.Address);
        });
        (0, globals_1.test)('ok <-  valid checksum format', () => {
            const exp = '0xCfb79a9c950b78E14c43efa621ebcf9660dbe01F';
            const address = src_1.Address.of(exp);
            (0, globals_1.expect)(address).toBeInstanceOf(src_1.Address);
        });
        (0, globals_1.test)('ok <-  valid uppercase', () => {
            const exp = '0xCFB79A9C950B78E14C43EFA621EBCF9660DBE01F';
            const address = src_1.Address.of(exp);
            (0, globals_1.expect)(address).toBeInstanceOf(src_1.Address);
        });
        (0, globals_1.test)('ok <- valid from shorter expression', () => {
            const exp = '0xcaffee';
            const address = src_1.Address.of(exp);
            (0, globals_1.expect)(address).toBeInstanceOf(src_1.Address);
            (0, globals_1.expect)(address.toString().length).toBe(src_1.Address.DIGITS + 2);
        });
        (0, globals_1.test)('error <- invalid', () => {
            const exp = '-0xcaffee';
            (0, globals_1.expect)(() => src_1.Address.of(exp)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('ofPrivateKey', () => {
        (0, globals_1.test)('ok <- private key', () => {
            const privateKey = (0, utils_1.hexToBytes)('5434c159b817c377a55f6be66369622976014e78bce2adfd3e44e5de88ce502f');
            const address = src_1.Address.ofPrivateKey(privateKey);
            (0, globals_1.expect)(address.toString()).toBe('0x769E8AA372c8309c834EA6749B88861FF73581FF');
        });
        (0, globals_1.test)('error <- invalid', () => {
            const privateKey = new Uint8Array([1, 2, 3, 4, 5]);
            (0, globals_1.expect)(() => src_1.Address.ofPrivateKey(privateKey)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('ofPublicKey', () => {
        (0, globals_1.test)('ok <- valid', () => {
            const publicKey = (0, utils_1.hexToBytes)('04a6711e14234b1d4e69aeed2acf18b9c3bd0e97db317b509516bd3a87e5b732685ccaf855d9f8a955bc1f420b4ebf8f682c2e480d98a360e7fd0c08e6eef65607');
            const address = src_1.Address.ofPublicKey(publicKey);
            (0, globals_1.expect)(address.toString()).toBe('0x769E8AA372c8309c834EA6749B88861FF73581FF');
        });
        (0, globals_1.test)('error <- invalid', () => {
            const publicKey = new Uint8Array([1, 2, 3, 4, 5]);
            (0, globals_1.expect)(() => src_1.Address.ofPublicKey(publicKey)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
});
