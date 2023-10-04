import { describe, expect, test } from '@jest/globals';
import { dataUtils } from '../../src/utils';

describe('utils/hex', () => {
    describe('toHexString', () => {
        test('should convert string to hex string without prefix by default', () => {
            expect(dataUtils.toHexString('Hello')).toBe('48656c6c6f');
        });

        test('should convert Uint8Array to hex string without prefix by default', () => {
            expect(
                dataUtils.toHexString(new Uint8Array([72, 101, 108, 108, 111]))
            ).toBe('48656c6c6f');
        });

        test('should convert string to hex string with prefix when specified', () => {
            expect(dataUtils.toHexString('Hello', { withPrefix: true })).toBe(
                '0x48656c6c6f'
            );
        });

        test('should convert Uint8Array to hex string with prefix when specified', () => {
            expect(
                dataUtils.toHexString(
                    new Uint8Array([72, 101, 108, 108, 111]),
                    {
                        withPrefix: true
                    }
                )
            ).toBe('0x48656c6c6f');
        });
    });

    describe('isHexString', () => {
        const validHexStrings = ['0x48656c6c6f', '48656c6c6f', '0x', ''];

        const invalidHexStrings = [
            '0xG8656c6c6f',
            'H8656c6c6f',
            '0x ',
            '0x48656c6c6fz'
        ];

        validHexStrings.forEach((hex) => {
            test(`should return true for valid hex string: ${hex}`, () => {
                expect(dataUtils.isHexString(hex)).toBe(true);
            });
        });

        invalidHexStrings.forEach((hex) => {
            test(`should return false for invalid hex string: ${hex}`, () => {
                expect(dataUtils.isHexString(hex)).toBe(false);
            });
        });
    });

    describe('removePrefix', () => {
        test('should remove "0x" prefix from hex string', () => {
            expect(dataUtils.removePrefix('0x48656c6c6f')).toBe('48656c6c6f');
        });

        test('should not modify hex string without "0x" prefix', () => {
            expect(dataUtils.removePrefix('48656c6c6f')).toBe('48656c6c6f');
        });
    });
});
