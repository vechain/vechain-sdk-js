import { describe, expect, test } from '@jest/globals';
import { dataUtils } from '../../../src';
import {
    invalidHexStrings,
    prefixedAndUnprefixedStrings,
    validHexStrings
} from './fixture';

/**
 * Hex data tests
 * @group unit/utils-data
 */
describe('utils/hex', () => {
    /**
     * Hex strings conversions
     */
    describe('Hex string conversion', () => {
        test('Should convert string to hex string without prefix by default', () => {
            expect(dataUtils.toHexString('Hello')).toBe('48656c6c6f');
        });

        test('Should convert Uint8Array to hex string without prefix by default', () => {
            expect(
                dataUtils.toHexString(new Uint8Array([72, 101, 108, 108, 111]))
            ).toBe('48656c6c6f');
        });

        test('Should convert string to hex string with prefix when specified', () => {
            expect(dataUtils.toHexString('Hello', { withPrefix: true })).toBe(
                '0x48656c6c6f'
            );
        });

        test('Should convert Uint8Array to hex string with prefix when specified', () => {
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

    /**
     * Hex string verifications
     */
    describe('Hex string verification', () => {
        validHexStrings.forEach((hex) => {
            test(`should return true for valid hex string: ${hex}`, () => {
                expect(dataUtils.isHexString(hex, false)).toBe(true);
            });
        });

        invalidHexStrings.forEach((hex) => {
            test(`should return false for invalid hex string: ${hex}`, () => {
                expect(dataUtils.isHexString(hex, false)).toBe(false);
            });
        });
    });

    /**
     * Hex prefixes
     */
    describe('Hex prefix', () => {
        /**
         * Correct removing of "0x" prefix
         */
        test('Should remove "0x" prefix from hex string', () => {
            prefixedAndUnprefixedStrings.forEach((prefixAndUnprefix) => {
                expect(dataUtils.removePrefix(prefixAndUnprefix.prefixed)).toBe(
                    prefixAndUnprefix.unprefixed
                );
            });
        });
    });
});
