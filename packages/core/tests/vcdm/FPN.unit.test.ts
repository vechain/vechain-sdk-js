import { describe, expect, test } from '@jest/globals';
import { FPN } from '../../src';
import { BigNumber } from 'bignumber.js';

describe('FPN class tests', () => {
    describe('abs method tests', () => {
        test('n < 0', () => {
            const n = -0.8;
            const actual = FPN.of(n).abs();
            const expected = BigNumber(n).abs();
            expect(actual.n).toEqual(expected.toNumber());
        });

        test('n > 0', () => {
            const n = 0.8;
            const actual = FPN.of(n).abs();
            const expected = BigNumber(n).abs();
            expect(actual.n).toEqual(expected.toNumber());
        });
    });

    describe('comparedTo method tests', () => {
        test('NaN ~ n -> null', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(null);
        });

        test('n ~ NaN -> null', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('-Infinity ~ n -> -1', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(-1);
        });

        test('+Infinity ~ n -> 1', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });

        test('n ~ -Infinity -> 1', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });

        test('n ~ +Infinity -> -1', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(-1);
        });

        test('-Infinity ~ -Infinity -> 0', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(0);
        });

        test('-Infinity ~ +Infinity -> -1', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(-1);
        });

        test('+Infinity ~ -Infinity -> 1', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });

        test('+Infinity ~ +Infinity -> 0', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(0);
        });

        test('l < r -> -1', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(-1);
        });

        test('l = r -> 0', () => {
            const l = 123.45;
            const r = l;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            // console.log(actual);
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(0);
        });

        test('l > r -> 1', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            // console.log(actual);
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });
    });

    describe('div method tests', () => {
        test('0/0 = NaN', () => {
            const dividend = 0;
            const divisor = 0;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('NaN / n = ', () => {
            const dividend = NaN;
            const divisor = 123.45;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / NaN = NaN', () => {
            const dividend = 123.45;
            const divisor = NaN;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / -Infinity = 0', () => {
            const dividend = 123.45;
            const divisor = -Infinity;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / +Infinity = 0', () => {
            const dividend = 123.45;
            const divisor = Infinity;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('-n / 0 = -Infinity', () => {
            const dividend = -123.45;
            const divisor = 0;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('+n / 0 = +Infinity', () => {
            const dividend = 123.45;
            const divisor = 0;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('x / y = periodic', () => {
            const dividend = -1;
            const divisor = 3;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('x / y = real', () => {
            const dividend = 355;
            const divisor = 113;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            const dp = 15; // BigNumber default precision diverges after 15 digits.
            expect(actual.n.toFixed(dp)).toBe(expected.toNumber().toFixed(dp));
        });

        test('x / y = integer', () => {
            const dividend = 355;
            const divisor = -5;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.n).toBe(expected.toNumber());
        });
    });

    describe('idiv method tests', () => {
        test('0/0 = NaN', () => {
            const dividend = 0;
            const divisor = 0;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('NaN / n = ', () => {
            const dividend = NaN;
            const divisor = 123.45;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / NaN = NaN', () => {
            const dividend = 123.45;
            const divisor = NaN;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / -Infinity = 0', () => {
            const dividend = 123.45;
            const divisor = -Infinity;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / +Infinity = 0', () => {
            const dividend = 123.45;
            const divisor = Infinity;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('-n / 0 = -Infinity', () => {
            const dividend = -123.45;
            const divisor = 0;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('+n / 0 = +Infinity', () => {
            const dividend = 123.45;
            const divisor = 0;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / integer', () => {
            const dividend = 5;
            const divisor = 3;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / rational', () => {
            const dividend = 5;
            const divisor = 0.7;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });
    });

    describe('eq method tests', () => {
        test('NaN = n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n = NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity = n -> false', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity = n -> false', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n = -Infinity -> false', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n = +Infinity -> false', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity = -Infinity -> true', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity = +Infinity -> false', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity = -Infinity -> false', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity = +Infinity -> true', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l < r -> false', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l = r -> true', () => {
            const l = 123.45;
            const r = l;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l > r -> false', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).eq(FPN.of(r));
            const expected = BigNumber(l).eq(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('gt method tests', () => {
        test('NaN > n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n > NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > n -> false', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity > n -> true', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n > -Infinity -> true', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n > +Infinity -> false', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > -Infinity -> false', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > +Infinity -> false', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity > -Infinity -> true', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity > +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l < r -> false', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l = r -> false', () => {
            const l = 123.45;
            const r = l;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l > r -> true', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).gt(FPN.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe('gte method tests', () => {
        test('NaN > n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('n > NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > n -> false', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity > n -> true', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n > -Infinity -> true', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n > +Infinity -> false', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > -Infinity -> true', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity > +Infinity -> false', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity > -Infinity -> true', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity > +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l < r -> false', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l = r -> true', () => {
            const l = 123.45;
            const r = l;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l > r -> true', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).gte(FPN.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe('isFinite method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FPN.of(n).isFinite();
            const expected = BigNumber(n).isFinite();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = FPN.of(n).isFinite();
            const expected = BigNumber(n).isFinite();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FPN.of(n).isFinite();
            const expected = BigNumber(n).isFinite();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n -> true', () => {
            const n = 123.45;
            const actual = FPN.of(n).isFinite();
            const expected = BigNumber(n).isFinite();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe(`isInfinite method tests`, () => {
        test('NaN -> false', () => {
            const actual = FPN.of(NaN).isInfinite();
            expect(actual).toBe(false);
        });

        test('-Infinite -> true', () => {
            const n = -Infinity;
            const actual = FPN.of(n).isInfinite();
            expect(actual).toBe(true);
        });

        test('+Infinite -> true', () => {
            const actual = FPN.of(Infinity).isInfinite();
            expect(actual).toBe(true);
        });

        test('n -> false', () => {
            const n = 0;
            const actual = FPN.of(n).isInfinite();
            expect(actual).toBe(false);
        });
    });

    describe('isInteger method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FPN.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> false', () => {
            const n = Infinity;
            const actual = FPN.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FPN.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('not integer -> false', () => {
            const n = 123.45;
            const actual = FPN.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('integer -> true', () => {
            const n = 12345;
            const actual = FPN.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe(`isNaN method tests`, () => {
        test('NaN -> true', () => {
            const n = NaN;
            const actual = FPN.of(n).isNaN();
            const expected = BigNumber(n).isNaN();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
        test('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = FPN.of(n).isNaN();
            const expected = BigNumber(n).isNaN();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FPN.of(n).isNaN();
            const expected = BigNumber(n).isNaN();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('finite -> false', () => {
            const n = 0;
            const actual = FPN.of(n).isNaN();
            const expected = BigNumber(n).isNaN();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('isNegative method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FPN.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> true', () => {
            const n = -Infinity;
            const actual = FPN.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FPN.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-n -> true', () => {
            const n = -123.45;
            const actual = FPN.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('0 -> false', () => {
            const n = 0;
            const actual = FPN.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n -> false', () => {
            const n = 123.45;
            const actual = FPN.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('lt method tests', () => {
        test('NaN < n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity < n -> true', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity < n -> false', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < -Infinity -> false', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < +Infinity -> true', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity < -Infinity -> false', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity < +Infinity -> true', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity < -Infinity -> false', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity < +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l < r -> true', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l = r -> false', () => {
            const l = 123.45;
            const r = l;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l > r -> false', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).lt(FPN.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('lte method tests', () => {
        test('NaN < n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity < n -> true', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity < n -> false', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < -Infinity -> false', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < +Infinity -> true', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity < -Infinity -> true', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity < +Infinity -> true', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity < -Infinity -> false', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity < +Infinity -> true', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l < r -> true', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l = r -> true', () => {
            const l = 123.45;
            const r = l;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l > r -> false', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).lte(FPN.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('minus method tests', () => {
        test('positive result', () => {
            const a = FPN.of(0.3);
            const b = FPN.of(0.1);
            const r = a.minus(b);
            console.log(r);
        });
    });

    describe('multipliedBy method tests', () => {
        test('negative auto scale', () => {
            const a = FPN.of(-3.5);
            const b = FPN.of(2, 0n);
            const r = a.multipliedBy(b);
            console.log(r);
        });
    });

    describe('plus method tests', () => {
        test('positive result', () => {
            const a = FPN.of(5.75);
            const b = FPN.of(2.5);
            const r = a.plus(b);
            console.log(r);
        });
    });

    describe('pow method tests', () => {
        test('NaN ^ ±e', () => {
            const b = NaN;
            const e = 123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FPN.of(-b).pow(FPN.of(e))).toEqual(actual);
        });

        test('±b ^ NaN', () => {
            const b = 123.45;
            const e = NaN;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FPN.of(-b).pow(FPN.of(e))).toEqual(actual);
        });

        test('±b ^ -Infinity', () => {
            const b = 123.45;
            const e = -Infinity;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FPN.of(-b).pow(FPN.of(e))).toEqual(actual);
        });

        test('±b ^ +Infinity', () => {
            const b = 123.45;
            const e = Infinity;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FPN.of(-b).pow(FPN.of(e))).toEqual(actual);
        });

        test('-Infinity ^ 0', () => {
            const b = -Infinity;
            const e = 0;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ 0', () => {
            const b = Infinity;
            const e = 0;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ -e', () => {
            const b = -Infinity;
            const e = -123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ +e', () => {
            const b = -Infinity;
            const e = -123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ -e', () => {
            const b = Infinity;
            const e = -123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ +e', () => {
            const b = Infinity;
            const e = 123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ -Infinity', () => {
            const b = -Infinity;
            const e = -Infinity;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ +Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ -Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ +Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('±b ^ -e', () => {
            const b = 3;
            const e = -2;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = BigNumber(b).pow(BigNumber(e));
            const fd = 16; // Fractional digits before divergence.
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            expect(FPN.of(-b).pow(FPN.of(e))).toEqual(actual);
        });

        test('±b ^ +e', () => {
            const b = 0.7;
            const e = -2;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = BigNumber(b).pow(BigNumber(e));
            const fd = 14; // Fractional digits before divergence.
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            expect(FPN.of(-b).pow(FPN.of(e))).toEqual(actual);
        });
    });

    test('scale', () => {
        const a = FPN.of(-1, 18n);
        console.log(a);
        console.log(a.dp(3n));
    });

    describe('squareRoot methods tests', () => {
        test('integer result', () => {
            const a = FPN.of(16);
            const r = a.squareRoot();
            console.log(r);
        });

        test('not integer result', () => {
            const a = FPN.of(3);
            const r = a.squareRoot();
            console.log(r);
        });
    });

    describe('toString methods tests', () => {
        test('< 1', () => {
            const n = FPN.of(0.0001);
            console.log(n.toString());
            console.log(n);
        });
        test('> 1', () => {
            const n = FPN.of(123.456);
            console.log(n.toString());
        });
        test('NaN', () => {
            const r = FPN.of(Number.NaN);
            console.log(r.toString());
        });
        test('Negative infinite', () => {
            const r = FPN.of(-Infinity);
            console.log(r.toString());
        });
        test('Positive infinite', () => {
            const r = FPN.of(Infinity);
            console.log(r.toString());
        });
    });
});
