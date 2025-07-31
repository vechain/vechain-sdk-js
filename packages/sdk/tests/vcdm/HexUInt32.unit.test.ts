import { describe, expect, test } from '@jest/globals';
import { HexUInt32 } from '@common/vcdm';
import { IllegalArgumentError } from '@errors';

/**
 * Test HexUInt32 class.
 * @group unit/vcdm
 */
describe('HexUInt32 class tests', () => {
    describe('Construction tests', () => {
        test('Return an HexUInt32 instance of the provided expression', () => {
            const expression = '0xcaffee';
            const expectedHexUInt32 =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';
            const hexUInt32 = HexUInt32.of(expression);
            expect(hexUInt32).toBeInstanceOf(HexUInt32);
            expect(hexUInt32.toString()).toEqual(expectedHexUInt32);
        });

        test('Checks if the provided expression is a valid 32 bytes unsigned hexadecimal value', () => {
            const expression =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            expect(HexUInt32.isValid(expression)).toBeTruthy();
        });

        test('Throw an error if the provided argument is not an unsigned expression', () => {
            const exp = '-0xnotUnsigned';
            expect(() => HexUInt32.of(exp)).toThrow(IllegalArgumentError);
        });
    });

    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBigInt = HexUInt32.of(255n);
            const ofBytes = HexUInt32.of(Uint8Array.of(255));
            const ofHex = HexUInt32.of('0xff');
            const ofNumber = HexUInt32.of(255);
            expect(ofBigInt.toString()).toHaveLength(66);
            expect(ofBigInt.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofNumber)).toBeTruthy();
        });
    });
});
