import { describe, expect, test } from '@jest/globals';
import { BigNumber } from 'bignumber.js';
import { FixedPointNumber, Txt } from '../../src';
import { InvalidDataType, InvalidOperation } from '@vechain/sdk-errors';

/**
 * Test FixedPointNumber class.
 * @group unit/vcdm
 */
describe('FixedPointNumber class tests', () => {
    describe('VeChain Data Model tests', () => {
        describe('get bi tests', () => {
            test('NaN throws exception', () => {
                expect(() => {
                    console.log(FixedPointNumber.NaN.bi);
                }).toThrow(InvalidOperation);
            });

            test('-Infinity throws exception', () => {
                expect(() => {
                    console.log(FixedPointNumber.NEGATIVE_INFINITY.bi);
                }).toThrow(InvalidOperation);
            });

            test('+Infinity throws exception', () => {
                expect(() => {
                    console.log(FixedPointNumber.POSITIVE_INFINITY.bi);
                }).toThrow(InvalidOperation);
            });

            test('Integers result the same', () => {
                const expected = 12345n;
                const actual = FixedPointNumber.of(expected).bi;
                expect(actual).toEqual(expected);
            });

            test('Rational is truncated', () => {
                const n = 123.45;
                const actual = FixedPointNumber.of(n).bi;
                const expected = BigInt(Math.trunc(n));
                expect(actual).toEqual(expected);
            });
        });

        test('get bytes tests', () => {
            const exp = Txt.of('123.45');
            const actual = FixedPointNumber.of(exp.toString()).bytes;
            const expected = exp.bytes;
            expect(actual).toEqual(expected);
        });

        describe('get n tests', () => {
            test('NaN', () => {
                expect(FixedPointNumber.NaN.n).toEqual(NaN);
            });

            test('-Infinity', () => {
                expect(FixedPointNumber.NEGATIVE_INFINITY.n).toEqual(-Infinity);
            });

            test('+Infinity', () => {
                expect(FixedPointNumber.POSITIVE_INFINITY.n).toEqual(Infinity);
            });

            test('±n', () => {
                const n = 123.45;
                expect(FixedPointNumber.of(n).n).toEqual(n);
                expect(FixedPointNumber.of(-n).n).toEqual(-n);
            });
        });

        describe('compareTo tests', () => {
            test('NaN ~ n throws exception', () => {
                const l = NaN;
                const r = 123.45;
                expect(() =>
                    FixedPointNumber.of(l).compareTo(FixedPointNumber.of(r))
                ).toThrow(InvalidOperation);
            });

            test('n ~ NaN -> throw exception', () => {
                const l = 123.45;
                const r = NaN;
                expect(() =>
                    FixedPointNumber.of(l).compareTo(FixedPointNumber.of(r))
                ).toThrow(InvalidOperation);
            });

            test('-Infinity ~ n -> -1', () => {
                const l = -Infinity;
                const r = 123.45;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(-1);
            });

            test('+Infinity ~ n -> 1', () => {
                const l = Infinity;
                const r = 123.45;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(1);
            });

            test('n ~ -Infinity -> 1', () => {
                const l = 123.45;
                const r = -Infinity;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(1);
            });

            test('n ~ +Infinity -> -1', () => {
                const l = 123.45;
                const r = +Infinity;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(-1);
            });

            test('-Infinity ~ -Infinity -> 0', () => {
                const l = -Infinity;
                const r = -Infinity;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(0);
            });

            test('-Infinity ~ +Infinity -> -1', () => {
                const l = -Infinity;
                const r = Infinity;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(-1);
            });

            test('+Infinity ~ -Infinity -> 1', () => {
                const l = Infinity;
                const r = -Infinity;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(1);
            });

            test('+Infinity ~ +Infinity -> 0', () => {
                const l = Infinity;
                const r = Infinity;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(0);
            });

            test('l < r -> -1', () => {
                const l = 123.45;
                const r = l * 2;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(-1);
            });

            test('l = r -> 0', () => {
                const l = 123.45;
                const r = l;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(0);
            });

            test('l > r -> 1', () => {
                const l = 123.45;
                const r = l / 2;
                const actual = FixedPointNumber.of(l).compareTo(
                    FixedPointNumber.of(r)
                );
                expect(actual).toBe(1);
            });
        });

        describe('isEqual method tests', () => {
            test('NaN = n -> false', () => {
                const l = NaN;
                const r = 123.45;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('n = NaN -> false', () => {
                const l = 123.45;
                const r = NaN;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('-Infinity = n -> false', () => {
                const l = -Infinity;
                const r = 123.45;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('+Infinity = n -> false', () => {
                const l = Infinity;
                const r = 123.45;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('n = -Infinity -> false', () => {
                const l = 123.45;
                const r = -Infinity;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('n = +Infinity -> false', () => {
                const l = 123.45;
                const r = +Infinity;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('-Infinity = -Infinity -> true', () => {
                const l = -Infinity;
                const r = -Infinity;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(true);
            });

            test('-Infinity = +Infinity -> false', () => {
                const l = -Infinity;
                const r = Infinity;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('+Infinity = -Infinity -> false', () => {
                const l = Infinity;
                const r = -Infinity;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('+Infinity = +Infinity -> true', () => {
                const l = Infinity;
                const r = Infinity;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(true);
            });

            test('l < r -> false', () => {
                const l = 123.45;
                const r = l * 2;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('l = r -> true', () => {
                const l = 123.45;
                const r = l;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(true);
            });

            test('l > r -> false', () => {
                const l = 123.45;
                const r = l / 2;
                const actual = FixedPointNumber.of(l).isEqual(
                    FixedPointNumber.of(r)
                );
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });
        });
    });

    describe('Construction tests', () => {
        test('of NaN', () => {
            const n = NaN;
            const fpn = FixedPointNumber.of(n);
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of -Infinity', () => {
            const n = -Infinity;
            const fpn = FixedPointNumber.of(n);
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of +Infinity', () => {
            const n = Infinity;
            const fpn = FixedPointNumber.of(n);
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of bigint', () => {
            const bi = Infinity;
            const fpn = FixedPointNumber.of(bi);
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.toString()).toBe(bi.toString());
        });

        test('of -n', () => {
            const n = -123.0067;
            const fpn = FixedPointNumber.of(n);
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of +n', () => {
            const n = 123.0067;
            const fpn = FixedPointNumber.of(n);
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of -n', () => {
            const n = -123.0067;
            const fpn = FixedPointNumber.of(n);
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of negative string', () => {
            const n = -123.0067;
            const fpn = FixedPointNumber.of(n.toString());
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of positive string', () => {
            const exp = '+123.45';
            const fpn = FixedPointNumber.of(exp);
            expect(fpn).toBeInstanceOf(FixedPointNumber);
            expect(fpn.n).toBe(Number(exp));
        });

        test('of an illegal expression throws exception', () => {
            const exp = 'abracadabra';
            expect(() => FixedPointNumber.of(exp)).toThrow(InvalidDataType);
        });
    });

    describe('abs method tests', () => {
        test('NaN -> Nan', () => {
            expect(FixedPointNumber.NaN.abs().isNaN()).toBe(true);
        });

        test('-Infinite -> +Infinite', () => {
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.abs().isPositiveInfinite()
            ).toBe(true);
        });

        test('+Infinite -> +Infinite', () => {
            expect(
                FixedPointNumber.POSITIVE_INFINITY.abs().isPositiveInfinite()
            ).toBe(true);
        });

        test('n < 0', () => {
            const n = -0.8;
            const actual = FixedPointNumber.of(n).abs();
            const expected = BigNumber(n).abs();
            expect(actual.n).toEqual(expected.toNumber());
        });

        test('n > 0', () => {
            const n = 0.8;
            const actual = FixedPointNumber.of(n).abs();
            const expected = BigNumber(n).abs();
            expect(actual.n).toEqual(expected.toNumber());
        });
    });

    describe('comparedTo method tests', () => {
        test('NaN ~ n -> null', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(null);
        });

        test('n ~ NaN -> null', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('-Infinity ~ n -> -1', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(-1);
        });

        test('+Infinity ~ n -> 1', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });

        test('n ~ -Infinity -> 1', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });

        test('n ~ +Infinity -> -1', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(-1);
        });

        test('-Infinity ~ -Infinity -> 0', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(0);
        });

        test('-Infinity ~ +Infinity -> -1', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(-1);
        });

        test('+Infinity ~ -Infinity -> 1', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });

        test('+Infinity ~ +Infinity -> 0', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(0);
        });

        test('l < r -> -1', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(-1);
        });

        test('l = r -> 0', () => {
            const l = 123.45;
            const r = l;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(0);
        });

        test('l > r -> 1', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FixedPointNumber.of(l).comparedTo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });
    });

    describe('dp methods', () => {
        test('scale down', () => {
            const fd = 5n;
            const n = 123.45;
            expect(FixedPointNumber.of(n).dp(fd)).toEqual(
                FixedPointNumber.of(n, fd)
            );
        });

        test('scale up', () => {
            const fd = 25n;
            const n = 123.45;
            expect(FixedPointNumber.of(n).dp(fd)).toEqual(
                FixedPointNumber.of(n, fd)
            );
        });
    });

    describe('div method tests', () => {
        test('0/0 = NaN', () => {
            const lr = 0;
            const r = 0;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('NaN / n = ', () => {
            const lr = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('-Infinite / ±Infinite -> NaN', () => {
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.div(
                    FixedPointNumber.NEGATIVE_INFINITY
                ).isNaN()
            ).toBe(true);
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.div(
                    FixedPointNumber.POSITIVE_INFINITY
                ).isNaN()
            ).toBe(true);
        });

        test('-Infinite / -n -> +Infinite', () => {
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.div(
                    FixedPointNumber.of(-123.45)
                ).isPositiveInfinite()
            ).toBe(true);
        });

        test('-Infinite / +n -> -Infinite', () => {
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.div(
                    FixedPointNumber.of(-123.45)
                ).isPositive()
            ).toBe(true);
        });

        test('+Infinite / ±Infinite -> NaN', () => {
            expect(
                FixedPointNumber.POSITIVE_INFINITY.div(
                    FixedPointNumber.NEGATIVE_INFINITY
                ).isNaN()
            ).toBe(true);
            expect(
                FixedPointNumber.POSITIVE_INFINITY.div(
                    FixedPointNumber.POSITIVE_INFINITY
                ).isNaN()
            ).toBe(true);
        });

        test('+Infinite / -n -> -Infinite', () => {
            expect(
                FixedPointNumber.POSITIVE_INFINITY.div(
                    FixedPointNumber.of(-123.45)
                ).isNegativeInfinite()
            ).toBe(true);
        });

        test('+Infinite / +n -> +Infinite', () => {
            expect(
                FixedPointNumber.POSITIVE_INFINITY.div(
                    FixedPointNumber.of(+123.45)
                ).isPositiveInfinite()
            ).toBe(true);
        });

        test('n / NaN = NaN', () => {
            const lr = 123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / -Infinity = 0', () => {
            const lr = 123.45;
            const r = -Infinity;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / +Infinity = 0', () => {
            const lr = 123.45;
            const r = Infinity;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('-n / 0 = -Infinity', () => {
            const lr = -123.45;
            const r = 0;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('+n / 0 = +Infinity', () => {
            const lr = 123.45;
            const r = 0;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('x / y = periodic', () => {
            const lr = -1;
            const r = 3;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('x / y = real', () => {
            const lr = 355;
            const r = 113;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            const dp = 15; // BigNumber default precision diverges after 15 digits.
            expect(actual.n.toFixed(dp)).toBe(expected.toNumber().toFixed(dp));
        });

        test('x / y = integer', () => {
            const lr = 355;
            const r = -5;
            const actual = FixedPointNumber.of(lr).div(FixedPointNumber.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
        });

        test('x / 1 = x scale test', () => {
            const l = 123.45;
            const r = 1;
            const actualUp = FixedPointNumber.of(l, 7n).div(
                FixedPointNumber.of(r, 5n)
            );
            const actualDn = FixedPointNumber.of(l, 5n).div(
                FixedPointNumber.of(r, 7n)
            );
            expect(actualUp.isEqual(actualDn)).toBe(true);
            expect(actualUp.isEqual(FixedPointNumber.of(l))).toBe(true);
        });
    });

    describe('idiv method tests', () => {
        test('0/0 = NaN', () => {
            const l = 0;
            const r = 0;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('NaN / n = ', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('-Infinite / ±Infinite -> NaN', () => {
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.idiv(
                    FixedPointNumber.NEGATIVE_INFINITY
                ).isNaN()
            ).toBe(true);
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.idiv(
                    FixedPointNumber.POSITIVE_INFINITY
                ).isNaN()
            ).toBe(true);
        });

        test('-Infinite / -n -> +Infinite', () => {
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.idiv(
                    FixedPointNumber.of(-123.45)
                ).isPositiveInfinite()
            ).toBe(true);
        });

        test('-Infinite / +n -> -Infinite', () => {
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.idiv(
                    FixedPointNumber.of(-123.45)
                ).isPositiveInfinite()
            ).toBe(true);
        });

        test('+Infinite / ±Infinite -> NaN', () => {
            expect(
                FixedPointNumber.POSITIVE_INFINITY.idiv(
                    FixedPointNumber.NEGATIVE_INFINITY
                ).isNaN()
            ).toBe(true);
            expect(
                FixedPointNumber.POSITIVE_INFINITY.idiv(
                    FixedPointNumber.POSITIVE_INFINITY
                ).isNaN()
            ).toBe(true);
        });

        test('+Infinite / -n -> -Infinite', () => {
            expect(
                FixedPointNumber.POSITIVE_INFINITY.idiv(
                    FixedPointNumber.of(-123.45)
                ).isNegativeInfinite()
            ).toBe(true);
        });

        test('+Infinite / +n -> +Infinite', () => {
            expect(
                FixedPointNumber.POSITIVE_INFINITY.idiv(
                    FixedPointNumber.of(123.45)
                ).isPositiveInfinite()
            ).toBe(true);
        });

        test('n / NaN = NaN', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / -Infinity = 0', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / +Infinity = 0', () => {
            const l = 123.45;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('-n / 0 = -Infinity', () => {
            const l = -123.45;
            const r = 0;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('+n / 0 = +Infinity', () => {
            const l = 123.45;
            const r = 0;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / integer', () => {
            const l = 5;
            const r = 3;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / rational', () => {
            const l = 5;
            const r = 0.7;
            const actual = FixedPointNumber.of(l).idiv(FixedPointNumber.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('x / 1 = x scale test', () => {
            const l = 123.45;
            const r = 1;
            const actualUp = FixedPointNumber.of(l, 7n).idiv(
                FixedPointNumber.of(r, 5n)
            );
            const actualDn = FixedPointNumber.of(l, 5n).idiv(
                FixedPointNumber.of(r, 7n)
            );
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actualUp.isEqual(actualDn)).toBe(true);
            expect(actualDn.n).toBe(expected.toNumber());
        });
    });

    describe('gt method tests', () => {
        test('NaN > n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n > NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > n -> false', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity > n -> true', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n > -Infinity -> true', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n > +Infinity -> false', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > -Infinity -> false', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > +Infinity -> false', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity > -Infinity -> true', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity > +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l < r -> false', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l = r -> false', () => {
            const l = 123.45;
            const r = l;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l > r -> true', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FixedPointNumber.of(l).gt(FixedPointNumber.of(r));
            const expected = BigNumber(l).gt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe('gte method tests', () => {
        test('NaN > n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
        });

        test('n > NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > n -> false', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity > n -> true', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n > -Infinity -> true', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n > +Infinity -> false', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity > -Infinity -> true', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity > +Infinity -> false', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity > -Infinity -> true', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity > +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l < r -> false', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l = r -> true', () => {
            const l = 123.45;
            const r = l;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l > r -> true', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FixedPointNumber.of(l).gte(FixedPointNumber.of(r));
            const expected = BigNumber(l).gte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe('isFinite method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FixedPointNumber.of(n).isFinite();
            const expected = BigNumber(n).isFinite();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = FixedPointNumber.of(n).isFinite();
            const expected = BigNumber(n).isFinite();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FixedPointNumber.of(n).isFinite();
            const expected = BigNumber(n).isFinite();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n -> true', () => {
            const n = 123.45;
            const actual = FixedPointNumber.of(n).isFinite();
            const expected = BigNumber(n).isFinite();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe(`isInfinite method tests`, () => {
        test('NaN -> false', () => {
            const actual = FixedPointNumber.of(NaN).isInfinite();
            expect(actual).toBe(false);
        });

        test('-Infinite -> true', () => {
            const n = -Infinity;
            const actual = FixedPointNumber.of(n).isInfinite();
            expect(actual).toBe(true);
        });

        test('+Infinite -> true', () => {
            const actual = FixedPointNumber.of(Infinity).isInfinite();
            expect(actual).toBe(true);
        });

        test('n -> false', () => {
            const n = 0;
            const actual = FixedPointNumber.of(n).isInfinite();
            expect(actual).toBe(false);
        });
    });

    describe('isInteger method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FixedPointNumber.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> false', () => {
            const n = Infinity;
            const actual = FixedPointNumber.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FixedPointNumber.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('not integer -> false', () => {
            const n = 123.45;
            const actual = FixedPointNumber.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('integer -> true', () => {
            const n = 12345;
            const actual = FixedPointNumber.of(n).isInteger();
            const expected = BigNumber(n).isInteger();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe('isIntegerExpression method tests', () => {
        test('not integer -> false', () => {
            const exp = '123.45';
            expect(FixedPointNumber.isIntegerExpression(exp)).toBe(false);
        });

        test('negative with - -> true', () => {
            const exp = '-12345';
            expect(FixedPointNumber.isIntegerExpression(exp)).toBe(true);
        });

        test('positive with + -> true', () => {
            const exp = '+12345';
            expect(FixedPointNumber.isIntegerExpression(exp)).toBe(true);
        });

        test('positive without + -> true', () => {
            const exp = '12345';
            expect(FixedPointNumber.isIntegerExpression(exp)).toBe(true);
        });
    });

    describe(`isNaN method tests`, () => {
        test('NaN -> true', () => {
            const n = NaN;
            const actual = FixedPointNumber.of(n).isNaN();
            const expected = BigNumber(n).isNaN();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
        test('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = FixedPointNumber.of(n).isNaN();
            const expected = BigNumber(n).isNaN();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FixedPointNumber.of(n).isNaN();
            const expected = BigNumber(n).isNaN();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('finite -> false', () => {
            const n = 0;
            const actual = FixedPointNumber.of(n).isNaN();
            const expected = BigNumber(n).isNaN();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('isNegative method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FixedPointNumber.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> true', () => {
            const n = -Infinity;
            const actual = FixedPointNumber.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FixedPointNumber.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-n -> true', () => {
            const n = -123.45;
            const actual = FixedPointNumber.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('0 -> false', () => {
            const n = 0;
            const actual = FixedPointNumber.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n -> false', () => {
            const n = 123.45;
            const actual = FixedPointNumber.of(n).isNegative();
            const expected = BigNumber(n).isNegative();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('isNegativeInfinite method tests', () => {
        test('NaN -> false', () => {
            expect(FixedPointNumber.of(NaN).isNegativeInfinite()).toBe(false);
        });

        test('-Infinite -> true', () => {
            expect(FixedPointNumber.of(-Infinity).isNegativeInfinite()).toBe(
                true
            );
        });

        test('+Infinite -> false', () => {
            expect(FixedPointNumber.of(Infinity).isNegativeInfinite()).toBe(
                false
            );
        });

        test('n -> false', () => {
            expect(FixedPointNumber.of(-123.45).isNegativeInfinite()).toBe(
                false
            );
            expect(FixedPointNumber.of(0).isNegativeInfinite()).toBe(false);
            expect(FixedPointNumber.of(123.45).isNegativeInfinite()).toBe(
                false
            );
        });
    });

    describe('isNumberExpression method tests', () => {
        describe('Return true', () => {
            test('±natural -> true', () => {
                expect(FixedPointNumber.isNumberExpression('0')).toBe(true);
                expect(FixedPointNumber.isNumberExpression('-1.5')).toBe(true);
                expect(FixedPointNumber.isNumberExpression('+1')).toBe(true);
            });

            test('±rational -> true', () => {
                expect(
                    FixedPointNumber.isNumberExpression(
                        '-32412341234.543563463'
                    )
                ).toBe(true);
                expect(
                    FixedPointNumber.isNumberExpression(
                        '1.54523532463463642352342354645363'
                    )
                ).toBe(true);
                expect(FixedPointNumber.isNumberExpression('+123.45')).toBe(
                    true
                );
            });

            test('±|0 < n < 1| without `0` prefix -> true', () => {
                expect(FixedPointNumber.isNumberExpression('.52434234')).toBe(
                    true
                );
                expect(FixedPointNumber.isNumberExpression('-.52434234')).toBe(
                    true
                );
                expect(FixedPointNumber.isNumberExpression('+.52434234')).toBe(
                    true
                );
            });
        });

        describe('Return false', () => {
            test('empty -> false', () => {
                expect(FixedPointNumber.isNumberExpression('')).toBeFalsy();
            });
            test('dot only -> false', () => {
                expect(FixedPointNumber.isNumberExpression('.')).toBe(false);
            });

            test('dot without fractional part -> false', () => {
                expect(FixedPointNumber.isNumberExpression('1.')).toBe(false);
            });

            test('illegal char -> false', () => {
                expect(FixedPointNumber.isNumberExpression('1,6')).toBe(false);
                expect(FixedPointNumber.isNumberExpression('1,6,7')).toBe(
                    false
                );
                expect(FixedPointNumber.isNumberExpression('1.6,7')).toBe(
                    false
                );
                expect(FixedPointNumber.isNumberExpression('1.6,7')).toBe(
                    false
                );
                expect(FixedPointNumber.isNumberExpression('1,6.7')).toBe(
                    false
                );
                expect(FixedPointNumber.isNumberExpression('1,6,7.8')).toBe(
                    false
                );
                expect(FixedPointNumber.isNumberExpression('0x152')).toBe(
                    false
                );
            });

            test('multiple dots', () => {
                expect(FixedPointNumber.isNumberExpression('1.6.')).toBe(false);
                expect(FixedPointNumber.isNumberExpression('1.6.7')).toBe(
                    false
                );
                expect(FixedPointNumber.isNumberExpression('1.6.7.')).toBe(
                    false
                );
                expect(FixedPointNumber.isNumberExpression('-1.5.6')).toBe(
                    false
                );
            });
        });
    });

    describe('isPositive method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FixedPointNumber.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = FixedPointNumber.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> true', () => {
            const n = Infinity;
            const actual = FixedPointNumber.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-n -> false', () => {
            const n = -123.45;
            const actual = FixedPointNumber.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('0 -> true', () => {
            const n = 0;
            const actual = FixedPointNumber.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n -> true', () => {
            const n = 123.45;
            const actual = FixedPointNumber.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe('isPositiveInfinite method tests', () => {
        test('NaN -> false', () => {
            expect(FixedPointNumber.of(NaN).isPositiveInfinite()).toBe(false);
        });

        test('-Infinite -> false', () => {
            expect(FixedPointNumber.of(-Infinity).isPositiveInfinite()).toBe(
                false
            );
        });

        test('+Infinite -> true', () => {
            expect(FixedPointNumber.of(Infinity).isPositiveInfinite()).toBe(
                true
            );
        });

        test('n -> false', () => {
            expect(FixedPointNumber.of(-123.45).isPositiveInfinite()).toBe(
                false
            );
            expect(FixedPointNumber.of(0).isPositiveInfinite()).toBe(false);
            expect(FixedPointNumber.of(123.45).isPositiveInfinite()).toBe(
                false
            );
        });
    });

    describe('isNaturalExpression method tests', () => {
        test('not integer -> false', () => {
            const exp = '123.45';
            expect(FixedPointNumber.isNaturalExpression(exp)).toBe(false);
        });

        test('negative with - -> false', () => {
            const exp = '-12345';
            expect(FixedPointNumber.isNaturalExpression(exp)).toBe(false);
        });

        test('positive with + -> false', () => {
            const exp = '+12345';
            expect(FixedPointNumber.isNaturalExpression(exp)).toBe(false);
        });

        test('positive without + -> true', () => {
            const exp = '12345';
            expect(FixedPointNumber.isNaturalExpression(exp)).toBe(true);
        });
    });

    describe('isZero method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FixedPointNumber.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = FixedPointNumber.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FixedPointNumber.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-n -> false', () => {
            const n = -123.45;
            const actual = FixedPointNumber.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('0 -> true', () => {
            const n = 0;
            const actual = FixedPointNumber.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+n -> false', () => {
            const n = 123.45;
            const actual = FixedPointNumber.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('lt method tests', () => {
        test('NaN < n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity < n -> true', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity < n -> false', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < -Infinity -> false', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < +Infinity -> true', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity < -Infinity -> false', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity < +Infinity -> true', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity < -Infinity -> false', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity < +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l < r -> true', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l = r -> false', () => {
            const l = 123.45;
            const r = l;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('l > r -> false', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FixedPointNumber.of(l).lt(FixedPointNumber.of(r));
            const expected = BigNumber(l).lt(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('lte method tests', () => {
        test('NaN < n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinity < n -> true', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity < n -> false', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < -Infinity -> false', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('n < +Infinity -> true', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity < -Infinity -> true', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-Infinity < +Infinity -> true', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+Infinity < -Infinity -> false', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinity < +Infinity -> true', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l < r -> true', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l = r -> true', () => {
            const l = 123.45;
            const r = l;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('l > r -> false', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FixedPointNumber.of(l).lte(FixedPointNumber.of(r));
            const expected = BigNumber(l).lte(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });
    });

    describe('minus method tests', () => {
        test('NaN - ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('±n - NaN -> NaN', () => {
            const l = NaN;
            const r = -123.45;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity - -Infinity -> NaN', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity - +Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('-Infinity - ±n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
            expect(actual.n).toBe(
                FixedPointNumber.of(l).minus(FixedPointNumber.of(-r)).n
            );
        });

        test('+Infinity - -Infinity -> +Infinity', () => {
            const l = +Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(+Infinity);
        });

        test('+Infinity - +Infinity -> NaN', () => {
            const l = +Infinity;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinity - ±n -> +Infinity', () => {
            const l = +Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(+Infinity);
            expect(actual.n).toBe(
                FixedPointNumber.of(l).minus(FixedPointNumber.of(-r)).n
            );
        });

        test('n - 0 -> n', () => {
            const l = 123.45;
            const r = 0;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.eq(FixedPointNumber.of(l))).toBe(true);
        });

        test('n - n -> 0 scale test', () => {
            const l = 123.45;
            const r = l;
            const actualUp = FixedPointNumber.of(l, 7n).minus(
                FixedPointNumber.of(r, 5n)
            );
            const actualDn = FixedPointNumber.of(l, 5n).minus(
                FixedPointNumber.of(r, 7n)
            );
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actualUp.n).toBe(expected.toNumber());
            expect(actualUp.eq(FixedPointNumber.ZERO)).toBe(true);
            expect(actualDn.eq(actualUp)).toBe(true);
        });

        test('l - r -> >0', () => {
            const l = 123.45;
            const r = 23.45678;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('l - r -> <0', () => {
            const l = 123.45;
            const r = -1234.5678;
            const actual = FixedPointNumber.of(l).minus(FixedPointNumber.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            console.log(expected.toString());
            console.log(actual.toString());
        });
    });

    describe('modulo method tests', () => {
        test('NaN % n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('n % NaN -> NaN', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinite % -Infinite -> NaN', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinite % +Infinite -> NaN', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinite % ±n -> NaN', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinite % -Infinite -> NaN', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinite % +Infinite -> NaN', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinite % ±n -> NaN', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('n % 0 -> 0', () => {
            const l = 123.45;
            const r = 0;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('integer % ±1 -> 0', () => {
            const l = 123;
            const r = 1;
            const actual = FixedPointNumber.of(l).modulo(
                FixedPointNumber.of(r)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n % ±1 -> 0 - scale test', () => {
            const l = 123.45;
            const r = 0.6789;
            const actualUp = FixedPointNumber.of(l, 7n).modulo(
                FixedPointNumber.of(r, 5n)
            );
            const actualDn = FixedPointNumber.of(l, 5n).modulo(
                FixedPointNumber.of(r, 7n)
            );
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actualUp.eq(FixedPointNumber.of(expected.toNumber()))).toBe(
                true
            );
            expect(actualUp.eq(actualDn)).toBe(true);
        });
    });

    describe('negated', () => {
        test('NaN -> NaN', () => {
            expect(FixedPointNumber.NaN.negated().isNaN()).toBe(true);
        });

        test('-Infinity -> +Infinity', () => {
            expect(
                FixedPointNumber.NEGATIVE_INFINITY.negated().isEqual(
                    FixedPointNumber.POSITIVE_INFINITY
                )
            ).toBe(true);
        });

        test('+Infinity -> -Infinity', () => {
            expect(
                FixedPointNumber.POSITIVE_INFINITY.negated().isEqual(
                    FixedPointNumber.NEGATIVE_INFINITY
                )
            ).toBe(true);
        });

        test('±0 -> ±0', () => {
            const n = FixedPointNumber.ZERO;
            expect(n.negated().isEqual(n)).toBe(true);
        });

        test('±n -> ±n', () => {
            const n = -123.45;
            expect(
                FixedPointNumber.of(n)
                    .negated()
                    .isEqual(FixedPointNumber.of(-n))
            );
        });
    });

    describe('plus method tests', () => {
        test('NaN + ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('±n + NaN -> NaN', () => {
            const l = NaN;
            const r = -123.45;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity + -Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('-Infinity + +Infinity -> NaN', () => {
            const l = -Infinity;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity + ±n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
            expect(actual.n).toBe(
                FixedPointNumber.of(l).plus(FixedPointNumber.of(-r)).n
            );
        });

        test('+Infinity + -Infinity -> NaN', () => {
            const l = +Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinity + +Infinity -> Infinity', () => {
            const l = +Infinity;
            const r = +Infinity;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('+Infinity + ±n -> +Infinity', () => {
            const l = +Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(+Infinity);
            expect(actual.n).toBe(
                FixedPointNumber.of(l).plus(FixedPointNumber.of(-r)).n
            );
        });

        test('n + 0 -> n', () => {
            const l = 123.45;
            const r = 0;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.eq(FixedPointNumber.of(l))).toBe(true);
        });

        test('n + -n -> 0 - scale test', () => {
            const l = 123.45;
            const r = -l;
            const actualUp = FixedPointNumber.of(l, 7n).plus(
                FixedPointNumber.of(r, 5n)
            );
            const actualDn = FixedPointNumber.of(l, 5n).plus(
                FixedPointNumber.of(r, 7n)
            );
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actualUp.n).toBe(expected.toNumber());
            expect(actualUp.eq(FixedPointNumber.ZERO)).toBe(true);
            expect(actualUp.eq(actualDn)).toBe(true);
        });

        test('l + r -> >0', () => {
            const fd = 13;
            const l = 0.1;
            const r = 0.2;
            const actual = FixedPointNumber.of(l).plus(FixedPointNumber.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            expect(actual.n).toBe(l + r);
        });
    });

    describe('pow method tests', () => {
        test('NaN ^ ±e', () => {
            const b = NaN;
            const e = 123.45;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FixedPointNumber.of(-b).pow(FixedPointNumber.of(e))).toEqual(
                actual
            );
        });

        test('±b ^ NaN', () => {
            const b = 123.45;
            const e = NaN;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FixedPointNumber.of(-b).pow(FixedPointNumber.of(e))).toEqual(
                actual
            );
        });

        test('±b ^ -Infinity', () => {
            const b = 123.45;
            const e = -Infinity;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FixedPointNumber.of(-b).pow(FixedPointNumber.of(e))).toEqual(
                actual
            );
        });

        test('±b ^ +Infinity', () => {
            const b = 123.45;
            const e = Infinity;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
            expect(FixedPointNumber.of(-b).pow(FixedPointNumber.of(e))).toEqual(
                actual
            );
        });

        test('-Infinity ^ 0', () => {
            const b = -Infinity;
            const e = 0;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ 0', () => {
            const b = Infinity;
            const e = 0;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ -e', () => {
            const b = -Infinity;
            const e = -123.45;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ +e', () => {
            const b = -Infinity;
            const e = -123.45;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ -e', () => {
            const b = Infinity;
            const e = -123.45;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ +e', () => {
            const b = Infinity;
            const e = 123.45;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ -Infinity', () => {
            const b = -Infinity;
            const e = -Infinity;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('-Infinity ^ +Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ -Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('+Infinity ^ +Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = b ** e;
            expect(actual.n).toBe(expected);
        });

        test('b ^ -e - scale test', () => {
            const b = 3;
            const e = -2;
            const actualUp = FixedPointNumber.of(b, 25n).pow(
                FixedPointNumber.of(e, 15n)
            );
            const actualDn = FixedPointNumber.of(b, 15n).pow(
                FixedPointNumber.of(e, 25n)
            );
            const expected = BigNumber(b).pow(BigNumber(e));
            const fd = 16; // Fractional digits before divergence.
            expect(actualUp.n.toFixed(fd)).toBe(
                expected.toNumber().toFixed(fd)
            );
            expect(actualUp.eq(actualDn)).toBe(true);
        });

        test('±b ^ +e - scale test', () => {
            const b = 0.7;
            const e = -2;
            const actual = FixedPointNumber.of(b).pow(FixedPointNumber.of(e));
            const expected = BigNumber(b).pow(BigNumber(e));
            const fd = 14; // Fractional digits before divergence.
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            expect(FixedPointNumber.of(-b).pow(FixedPointNumber.of(e))).toEqual(
                actual
            );
        });

        test('±b ^ 0 = 1', () => {
            const b = 123.45;
            const e = 0;
            const expected = FixedPointNumber.of(1);
            const actualFromNegative = FixedPointNumber.of(-b).pow(
                FixedPointNumber.of(e)
            );
            const actualFromPositive = FixedPointNumber.of(b).pow(
                FixedPointNumber.of(e)
            );
            expect(actualFromNegative.isEqual(expected)).toBe(true);
            expect(actualFromPositive.isEqual(expected)).toBe(true);
        });
    });

    describe('scale method tests', () => {
        test('NaN -> NaN', () => {
            const n = Number.NaN;
            const actual = FixedPointNumber.of(n).scale();
            expect(actual.isNaN()).toBe(true);
        });

        test('-Infinity -> -Infinity', () => {
            const n = Number.NEGATIVE_INFINITY;
            const actual = FixedPointNumber.of(n).scale();
            expect(actual.isNegativeInfinite()).toBe(true);
        });

        test('+Infinity -> +Infinity', () => {
            const n = Number.POSITIVE_INFINITY;
            const actual = FixedPointNumber.of(n).scale();
            expect(actual.isPositiveInfinite()).toBe(true);
        });

        test('scale down', () => {
            const fd = 2n;
            const n = 123.45;
            const expected = FixedPointNumber.of(n, fd);
            const actual = expected.dp(127).scale();
            expect(actual.isEqual(expected)).toBe(true);
            expect(actual.fd).toBe(expected.fd);
        });
    });

    describe('sqrt method tests', () => {
        test('NaN -> NaN', () => {
            const n = NaN;
            const actual = FixedPointNumber.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity -> NaN', () => {
            const actual = FixedPointNumber.NEGATIVE_INFINITY.sqrt();
            const expected = Math.sqrt(-Infinity);
            expect(actual.n).toBe(expected);
            expect(actual.n).toBe(NaN);
        });

        test('+Infinity -> +Infinity', () => {
            const n = Infinity;
            const actual = FixedPointNumber.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('-n -> NaN', () => {
            const n = -123.45;
            const actual = FixedPointNumber.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('n -> integer', () => {
            const n = 16;
            const actual = FixedPointNumber.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n).toBe(expected.toNumber());
        });

        test('n -> rational', () => {
            const fd = 13;
            const n = 3;
            const actual = FixedPointNumber.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
        });
    });

    describe('times method tests', () => {
        test('NaN * ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('±n * NaN -> NaN', () => {
            const l = -123.45;
            const r = NaN;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity * -Infinity -> +Infinity', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('-Infinity * +Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('-Infinity * -n -> +Infinity', () => {
            const l = -Infinity;
            const r = -123.45;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('-Infinity * +n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('+Infinity * -Infinity -> -Infinity', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('+Infinity * +Infinity -> +Infinity', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('+Infinity * -n -> -Infinity', () => {
            const l = Infinity;
            const r = -123.45;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('+Infinity * +n -> +Infinity', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FixedPointNumber.of(l).times(FixedPointNumber.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('l * r - scale test', () => {
            const l = 0.6;
            const r = 3;
            const actualUp = FixedPointNumber.of(l, 7n).times(
                FixedPointNumber.of(r, 5n)
            );
            const actualDn = FixedPointNumber.of(l, 5n).times(
                FixedPointNumber.of(r, 7n)
            );
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actualUp.eq(FixedPointNumber.of(expected.toNumber()))).toBe(
                true
            );
            expect(actualUp.eq(actualDn)).toBe(true);
        });
    });

    describe('toString methods tests', () => {
        test('< 1', () => {
            const n = FixedPointNumber.of(0.0001);
            console.log(n.toString());
            console.log(n);
        });
        test('> 1', () => {
            const n = FixedPointNumber.of(123.456);
            console.log(n.toString());
        });
        test('NaN', () => {
            const r = FixedPointNumber.of(Number.NaN);
            console.log(r.toString());
        });
        test('Negative infinite', () => {
            const r = FixedPointNumber.of(-Infinity);
            console.log(r.toString());
        });
        test('Positive infinite', () => {
            const r = FixedPointNumber.of(Infinity);
            console.log(r.toString());
        });
    });
});
