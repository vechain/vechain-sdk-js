import { describe, expect, test } from '@jest/globals';
import { HexUInt, BlockRef, IllegalArgumentError } from '../../src';

const BlockRefFixture = {
    invalid: {
        short: '0x0101d054',
        noHex: '0xInvalidThorID'
    },
    valid: {
        bytes: '0x0101d05409d55cce',
        number: '0x00000000000000ff' // This safely casts to number.
    }
};

/**
 * Test BlockRef class.
 * @group unit/vcdm
 */
describe('BlockRef class tests.', () => {
    describe('Construction tests', () => {
        test('Return a BlockRef instance if the passed argument is an array of bytes', () => {
            const exp = HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = BlockRef.of(exp.bytes);
            expect(tid).toBeInstanceOf(BlockRef);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a BlockRef instance if the passed argument is a bigint', () => {
            const exp = HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = BlockRef.of(exp.bi);
            expect(tid).toBeInstanceOf(BlockRef);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a BlockRef instance if the passed argument is a number', () => {
            const exp = HexUInt.of(BlockRefFixture.valid.number);
            const tid = BlockRef.of(exp.n); // This is a safe number cast.
            expect(tid).toBeInstanceOf(BlockRef);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a BlockRef instance if the passed argument is a `0x` prefixed string', () => {
            const exp = HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = BlockRef.of(exp.toString());
            expect(tid).toBeInstanceOf(BlockRef);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a BlockRef instance if the passed argument is a not prefixed string', () => {
            const exp = HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = BlockRef.of(exp.digits);
            expect(tid).toBeInstanceOf(BlockRef);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a BlockRef instance if the passed argument is a HexUint instance', () => {
            const exp = HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = BlockRef.of(exp);
            expect(tid).toBeInstanceOf(BlockRef);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Throw an error if the passed argument is a negative bigint', () => {
            expect(() => BlockRef.of(-1)).toThrow(IllegalArgumentError);
        });

        test('Throw an error if the passed argument is a negative number', () => {
            expect(() => BlockRef.of(-1n)).toThrow(IllegalArgumentError);
        });
    });

    describe('isValid method tests', () => {
        test('Return false for no hex expression', () => {
            expect(BlockRef.isValid(BlockRefFixture.invalid.noHex)).toBe(false);
        });

        test('Return false for short expression', () => {
            expect(BlockRef.isValid(BlockRefFixture.invalid.short)).toBe(false);
        });

        test('Return true for valid `0x` prefixed expression', () => {
            expect(BlockRef.isValid(BlockRefFixture.valid.bytes)).toBe(true);
        });

        test('Return true for valid `not prefixed expression', () => {
            expect(
                BlockRef.isValid(HexUInt.of(BlockRefFixture.valid.bytes).digits)
            ).toBe(true);
        });
    });

    describe('isValid0x method tests', () => {
        test('Return false for no hex expression', () => {
            expect(BlockRef.isValid0x(BlockRefFixture.invalid.noHex)).toBe(
                false
            );
        });

        test('Return false for short expression', () => {
            expect(BlockRef.isValid0x(BlockRefFixture.invalid.short)).toBe(
                false
            );
        });

        test('Return true for valid `0x` prefixed expression', () => {
            expect(BlockRef.isValid0x(BlockRefFixture.valid.bytes)).toBe(true);
        });

        test('Return false for valid `not prefixed expression', () => {
            expect(
                BlockRef.isValid0x(
                    HexUInt.of(BlockRefFixture.valid.bytes).digits
                )
            ).toBe(false);
        });
    });

    test('digits property should return 16 characters', () => {
        const tid = BlockRef.of(0);
        expect(tid.digits.length).toBe(16);
    });

    test('toString method should return 18 characters', () => {
        const tid = BlockRef.of(0);
        expect(tid.toString().length).toBe(18);
    });
});
