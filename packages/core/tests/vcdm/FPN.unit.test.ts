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

    describe('compareTo method tests', () => {
        test('NaN ~ n', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('n ~ NaN', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('-Infinity ~ n', () => {
            const l = Number.NEGATIVE_INFINITY;
            const r = 123.45;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('+Infinity ~ n', () => {
            const l = Number.POSITIVE_INFINITY;
            const r = 123.45;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('n ~ -Infinity', () => {
            const l = Number.NEGATIVE_INFINITY;
            const r = 123.45;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('n ~ +Infinity', () => {
            const l = 123.45;
            const r = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('-Infinity ~ -Infinity', () => {
            const l = Number.NEGATIVE_INFINITY;
            const r = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('-Infinity ~ +Infinity', () => {
            const l = Number.NEGATIVE_INFINITY;
            const r = Number.POSITIVE_INFINITY;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('+Infinity ~ -Infinity', () => {
            const l = Number.POSITIVE_INFINITY;
            const r = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('+Infinity ~ +Infinity', () => {
            const l = Number.POSITIVE_INFINITY;
            const r = Number.POSITIVE_INFINITY;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('l < r', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('l = r', () => {
            const l = 123.45;
            const r = l;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            // console.log(actual);
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('l > r', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).compareTo(FPN.of(r));
            // console.log(actual);
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });
    });

    // describe('decimalPlaces method tests', () => {
    //     test('scale down', () => {
    //         const n = 1234.56;
    //         const dp = 1;
    //         const actual = FPN.of(n); // .decimalPlaces(dp);
    //         console.log(actual.toString());
    //         const expected = BigNumber(n).decimalPlaces(dp);
    //         // TODO: expect(actual.n).toBe(expected.toNumber());
    //     });
    //
    //     test('scale up', () => {
    //         const n = 1234.56;
    //         const dp = 4;
    //         const actual = FPN.of(n).decimalPlaces(dp);
    //         console.log(actual.toString());
    //         const expected = BigNumber(n).decimalPlaces(dp);
    //         // TODO: expect(actual.n).toBe(expected.toNumber());
    //     });
    //
    //     test('no scale', () => {
    //         // TODO
    //     });
    // });

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
            const divisor = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(dividend).div(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).div(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / +Infinity = 0', () => {
            const dividend = 123.45;
            const divisor = Number.POSITIVE_INFINITY;
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
            const divisor = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(dividend).idiv(FPN.of(divisor));
            // console.log(actual.toString());
            const expected = BigNumber(dividend).idiv(BigNumber(divisor));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / +Infinity = 0', () => {
            const dividend = 123.45;
            const divisor = Number.POSITIVE_INFINITY;
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

    describe('pow method tests', () => {
        test('NaN ^ ±e', () => {
            const b = NaN;
            const e = 123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FPN.of(-b).pow(FPN.of(e))).toBe(actual);
        });

        test('±b ^ NaN', () => {
            const b = 123.45;
            const e = NaN;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FPN.of(-b).pow(FPN.of(e))).toBe(actual);
        });

        test('±b ^ -Infinity', () => {
            const b = 123.45;
            const e = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FPN.of(-b).pow(FPN.of(e))).toBe(actual);
        });

        test('±b ^ +Infinity', () => {
            const b = 123.45;
            const e = Number.POSITIVE_INFINITY;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FPN.of(-b).pow(FPN.of(e))).toBe(actual);
        });

        test('-Infinity ^ 0', () => {
            const b = Number.NEGATIVE_INFINITY;
            const e = 0;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ 0', () => {
            const b = Number.POSITIVE_INFINITY;
            const e = 0;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ -e', () => {
            const b = Number.NEGATIVE_INFINITY;
            const e = -123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ +e', () => {
            const b = Number.NEGATIVE_INFINITY;
            const e = -123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ -e', () => {
            const b = Number.POSITIVE_INFINITY;
            const e = -123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ +e', () => {
            const b = Number.POSITIVE_INFINITY;
            const e = 123.45;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ -Infinity', () => {
            const b = Number.NEGATIVE_INFINITY;
            const e = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ +Infinity', () => {
            const b = Number.NEGATIVE_INFINITY;
            const e = Number.POSITIVE_INFINITY;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ -Infinity', () => {
            const b = Number.NEGATIVE_INFINITY;
            const e = Number.POSITIVE_INFINITY;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ +Infinity', () => {
            const b = Number.NEGATIVE_INFINITY;
            const e = Number.POSITIVE_INFINITY;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('±b ^ -e', () => {
            const b = 3;
            const e = -2;
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = BigNumber(b).pow(BigNumber(e));
            // expect(actual.dp(16).n).toBe(expected.toNumber());
        });
        test('±b ^ +e', () => {});


        test('power of < 1', () => {
            const b = FPN.of(4, 18n);
            const e = FPN.of(-2);
            const r = b.exponentiatedBy(e);
            console.log(r);
        });

        test('power of 0', () => {
            const b = FPN.of(0.7);
            const e = FPN.of(0);
            const r = b.exponentiatedBy(e);
            console.log(r);
        });

        test('power of 1', () => {
            const b = FPN.of(0.7);
            const e = FPN.of(1);
            const r = b.exponentiatedBy(e);
            console.log(r);
        });

        test('power of > 1', () => {
            const b = FPN.of(1.5);
            const e = FPN.of(3);
            const r = b.exponentiatedBy(e);
            console.log(r);
        });
    });

    describe('isEqual method tests', () => {
        test('NaN = n', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('n = NaN', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('-Infinity = n', () => {
            const l = Number.NEGATIVE_INFINITY;
            const r = 123.45;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('+Infinity = n', () => {
            const l = Number.POSITIVE_INFINITY;
            const r = 123.45;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('n = -Infinity', () => {
            const l = Number.NEGATIVE_INFINITY;
            const r = 123.45;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('n = +Infinity', () => {
            const l = 123.45;
            const r = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('-Infinity = -Infinity', () => {
            const l = Number.NEGATIVE_INFINITY;
            const r = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('-Infinity = +Infinity', () => {
            const l = Number.NEGATIVE_INFINITY;
            const r = Number.POSITIVE_INFINITY;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('+Infinity = -Infinity', () => {
            const l = Number.POSITIVE_INFINITY;
            const r = Number.NEGATIVE_INFINITY;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('+Infinity = +Infinity', () => {
            const l = Number.POSITIVE_INFINITY;
            const r = Number.POSITIVE_INFINITY;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('l < r', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('l = r', () => {
            const l = 123.45;
            const r = l;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('l > r', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).isEqual(FPN.of(r));
            const expected = BigNumber(l).isEqualTo(BigNumber(r));
            expect(actual).toBe(expected);
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
            const r = FPN.of(Number.NEGATIVE_INFINITY);
            console.log(r.toString());
        });
        test('Positive infinite', () => {
            const r = FPN.of(Number.POSITIVE_INFINITY);
            console.log(r.toString());
        });
    });
});
