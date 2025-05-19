import { describe, expect, test } from '@jest/globals';
import { HexUInt, Nonce } from '@vcdm';

/**
 * Test Nonce class.
 * @group unit/vcdm
 */
describe('Nonce class tests', () => {
    describe('Construction tests', () => {
        test('Return a Nonce instance if the passed argument is zero bigint', () => {
            const n = Nonce.of(0n);
            expect(n).toBeInstanceOf(Nonce);
            expect(n.toString()).toEqual('0x00000000');
        });

        test('Return a Nonce instance if the passed argument is zero number', () => {
            const n = Nonce.of(0);
            expect(n).toBeInstanceOf(Nonce);
            expect(n.toString()).toEqual('0x00000000');
        });

        test('Return a Nonce instance if the passed argument is zero string', () => {
            const n = Nonce.of('0');
            expect(n).toBeInstanceOf(Nonce);
            expect(n.toString()).toEqual('0x00000000');
        });

        test('Return a Nonce instance if the passed argument is zero hex string', () => {
            const n = Nonce.of('0x00000000');
            expect(n).toBeInstanceOf(Nonce);
            expect(n.toString()).toEqual('0x00000000');
        });

        test('Return a Nonce instance if the passed argument is zero Uint8Array', () => {
            const n = Nonce.of(new Uint8Array([0, 0, 0, 0]));
            expect(n).toBeInstanceOf(Nonce);
            expect(n.toString()).toEqual('0x00000000');
        });

        test('Return a Nonce instance if the passed argument is zero HexUInt', () => {
            const n = Nonce.of(HexUInt.of(0));
            expect(n).toBeInstanceOf(Nonce);
            expect(n.toString()).toEqual('0x00000000');
        });
    });

    describe('Instance validation tests', () => {
        describe('isValid', () => {
            test('should return true for valid 8-digit hex string without prefix', () => {
                expect(Nonce.isValid('00000000')).toBe(true);
                expect(Nonce.isValid('12345678')).toBe(true);
                expect(Nonce.isValid('abcdef12')).toBe(true);
            });

            test('should return true for valid 8-digit hex string with 0x prefix', () => {
                expect(Nonce.isValid('0x00000000')).toBe(true);
                expect(Nonce.isValid('0x12345678')).toBe(true);
                expect(Nonce.isValid('0xabcdef12')).toBe(true);
            });

            test('should return false for invalid hex strings', () => {
                expect(Nonce.isValid('invalid')).toBe(false);
                expect(Nonce.isValid('0xinvalid')).toBe(false);
                expect(Nonce.isValid('0xg1234567')).toBe(false);
            });

            test('should return false for hex strings with incorrect length', () => {
                expect(Nonce.isValid('1234567')).toBe(false);
                expect(Nonce.isValid('123456789')).toBe(false);
                expect(Nonce.isValid('0x1234567')).toBe(false);
                expect(Nonce.isValid('0x123456789')).toBe(false);
            });
        });

        describe('isValid0x', () => {
            test('should return true for valid 8-digit hex strings with 0x prefix', () => {
                expect(Nonce.isValid0x('0x00000000')).toBe(true);
                expect(Nonce.isValid0x('0x12345678')).toBe(true);
                expect(Nonce.isValid0x('0xabcdef12')).toBe(true);
            });

            test('should return false for hex strings without 0x prefix', () => {
                expect(Nonce.isValid0x('00000000')).toBe(false);
                expect(Nonce.isValid0x('12345678')).toBe(false);
                expect(Nonce.isValid0x('abcdef12')).toBe(false);
            });

            test('should return false for invalid hex strings with 0x prefix', () => {
                expect(Nonce.isValid0x('0xinvalid')).toBe(false);
                expect(Nonce.isValid0x('0xg1234567')).toBe(false);
            });

            test('should return false for hex strings with incorrect length', () => {
                expect(Nonce.isValid0x('0x1234567')).toBe(false);
                expect(Nonce.isValid0x('0x123456789')).toBe(false);
            });
        });
    });
});
