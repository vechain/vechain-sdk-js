import { describe, expect, test } from '@jest/globals';
import { HexUInt, ThorId } from '@vcdm';
import { IllegalArgumentError } from '@errors';

const ThorIdFixture = {
    invalid: {
        short: '0x271f7db20141001975f71deb8fca90d6b22b8d6610d',
        noHex: '0xInvalidThorID'
    },
    valid: {
        bytes: '0x271f7db20141001975f71deb8fca90d6b22b8d6610dfb5a3e0bbeaf78b5a4891',
        number: '0x00000000000000000000000000000000000000000000000000000000000000ff' // This safely casts to number.
    }
};

/**
 * Test ThorId class.
 * @group unit/vcdm
 */
describe('ThorId class tests.', () => {
    describe('Construction tests', () => {
        test('Return a ThorId instance if the passed argument is an array of bytes', () => {
            const exp = HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = ThorId.of(exp.bytes);
            expect(tid).toBeInstanceOf(ThorId);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a ThorId instance if the passed argument is a bigint', () => {
            const exp = HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = ThorId.of(exp.bi);
            expect(tid).toBeInstanceOf(ThorId);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a ThorId instance if the passed argument is a number', () => {
            const exp = HexUInt.of(ThorIdFixture.valid.number);
            const tid = ThorId.of(exp.n); // This is a safe number cast.
            expect(tid).toBeInstanceOf(ThorId);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a ThorId instance if the passed argument is a `0x` prefixed string', () => {
            const exp = HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = ThorId.of(exp.toString());
            expect(tid).toBeInstanceOf(ThorId);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a ThorId instance if the passed argument is a not prefixed string', () => {
            const exp = HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = ThorId.of(exp.digits);
            expect(tid).toBeInstanceOf(ThorId);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Return a ThorId instance if the passed argument is a HexUint instance', () => {
            const exp = HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = ThorId.of(exp);
            expect(tid).toBeInstanceOf(ThorId);
            expect(tid.isEqual(exp)).toBe(true);
        });

        test('Throw an error if the passed argument is a negative bigint', () => {
            expect(() => ThorId.of(-1)).toThrow(IllegalArgumentError);
        });

        test('Throw an error if the passed argument is a negative number', () => {
            expect(() => ThorId.of(-1n)).toThrow(IllegalArgumentError);
        });
    });

    describe('isValid method tests', () => {
        test('Return false for no hex expression', () => {
            expect(ThorId.isValid(ThorIdFixture.invalid.noHex)).toBe(false);
        });

        test('Return false for short expression', () => {
            expect(ThorId.isValid(ThorIdFixture.invalid.short)).toBe(false);
        });

        test('Return true for valid `0x` prefixed expression', () => {
            expect(ThorId.isValid(ThorIdFixture.valid.bytes)).toBe(true);
        });

        test('Return true for valid `not prefixed expression', () => {
            expect(
                ThorId.isValid(HexUInt.of(ThorIdFixture.valid.bytes).digits)
            ).toBe(true);
        });
    });

    describe('isValid0x method tests', () => {
        test('Return false for no hex expression', () => {
            expect(ThorId.isValid0x(ThorIdFixture.invalid.noHex)).toBe(false);
        });

        test('Return false for short expression', () => {
            expect(ThorId.isValid0x(ThorIdFixture.invalid.short)).toBe(false);
        });

        test('Return true for valid `0x` prefixed expression', () => {
            expect(ThorId.isValid0x(ThorIdFixture.valid.bytes)).toBe(true);
        });

        test('Return false for valid `not prefixed expression', () => {
            expect(
                ThorId.isValid0x(HexUInt.of(ThorIdFixture.valid.bytes).digits)
            ).toBe(false);
        });
    });

    test('digits property should return 64 characters', () => {
        const tid = ThorId.of(0);
        expect(tid.digits.length).toBe(64);
    });

    test('toString method should return 66 characters', () => {
        const tid = ThorId.of(0);
        expect(tid.toString().length).toBe(66);
    });
});
