import { describe, expect, test } from '@jest/globals';
import { HexUInt, IllegalArgumentError } from '../../src';

/**
 * Test HexUInt class.
 * @group unit/vcdm
 */
describe('HexUInt class tests', () => {
    describe('Construction tests', () => {
        test('Return an HexUInt instance if the passed argument is positive', () => {
            const exp = '0xcaffee';
            const hi = HexUInt.of(exp);
            expect(hi).toBeInstanceOf(HexUInt);
        });

        test('Throw an error if the passed argument is negative', () => {
            const exp = '-0xcaffee';
            expect(() => HexUInt.of(exp)).toThrow(IllegalArgumentError);
        });
    });

    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = HexUInt.of(255n);
            const ofBytes = HexUInt.of(Uint8Array.of(255));
            const ofHex = HexUInt.of('0xff');
            const ofN = HexUInt.of(255);
            expect(ofBi.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });
});
