import { describe, expect, test } from '@jest/globals';
import { BigNumber } from 'bignumber.js';
import { FPN, Txt } from '../../src';
import { InvalidOperation } from '@vechain/sdk-errors';

/**
 * Test FPN class.
 * @group unit/vcdm
 */
describe('FPN class tests', () => {
    describe('VeChain Data Model tests', () => {
        describe('get bi tests', () => {
            test('NaN throws exception', () => {
                expect(() => {
                    console.log(FPN.NaN.bi);
                }).toThrow(InvalidOperation);
            });

            test('-Infinity throws exception', () => {
                expect(() => {
                    console.log(FPN.NEGATIVE_INFINITY.bi);
                }).toThrow(InvalidOperation);
            });

            test('+Infinity throws exception', () => {
                expect(() => {
                    console.log(FPN.POSITIVE_INFINITY.bi);
                }).toThrow(InvalidOperation);
            });

            test('Integers result the same', () => {
                const expected = 12345n;
                const actual = FPN.of(expected).bi;
                expect(actual).toEqual(expected);
            });

            test('Rational is truncated', () => {
                const n = 123.45;
                const actual = FPN.of(n).bi;
                const expected = BigInt(Math.trunc(n));
                expect(actual).toEqual(expected);
            });
        });

        test('get bytes tests', () => {
            const exp = Txt.of('123.45');
            const actual = FPN.of(exp.toString()).bytes;
            const expected = exp.bytes;
            expect(actual).toEqual(expected);
        });

        describe('get n tests', () => {
            test('NaN', () => {
                expect(FPN.NaN.n).toEqual(NaN);
            });

            test('-Infinity', () => {
                expect(FPN.NEGATIVE_INFINITY.n).toEqual(-Infinity);
            });

            test('+Infinity', () => {
                expect(FPN.POSITIVE_INFINITY.n).toEqual(Infinity);
            });

            test('±n', () => {
                const n = 123.45;
                expect(FPN.of(n).n).toEqual(n);
                expect(FPN.of(-n).n).toEqual(-n);
            });
        });

        describe('compareTo tests', () => {
            test('NaN ~ n throws exception', () => {
                const l = NaN;
                const r = 123.45;
                expect(() => FPN.of(l).compareTo(FPN.of(r))).toThrow(
                    InvalidOperation
                );
            });

            test('n ~ NaN -> throw exception', () => {
                const l = 123.45;
                const r = NaN;
                expect(() => FPN.of(l).compareTo(FPN.of(r))).toThrow(
                    InvalidOperation
                );
            });

            test('-Infinity ~ n -> -1', () => {
                const l = -Infinity;
                const r = 123.45;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(-1);
            });

            test('+Infinity ~ n -> 1', () => {
                const l = Infinity;
                const r = 123.45;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(1);
            });

            test('n ~ -Infinity -> 1', () => {
                const l = 123.45;
                const r = -Infinity;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(1);
            });

            test('n ~ +Infinity -> -1', () => {
                const l = 123.45;
                const r = +Infinity;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(-1);
            });

            test('-Infinity ~ -Infinity -> 0', () => {
                const l = -Infinity;
                const r = -Infinity;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(0);
            });

            test('-Infinity ~ +Infinity -> -1', () => {
                const l = -Infinity;
                const r = Infinity;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(-1);
            });

            test('+Infinity ~ -Infinity -> 1', () => {
                const l = Infinity;
                const r = -Infinity;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(1);
            });

            test('+Infinity ~ +Infinity -> 0', () => {
                const l = Infinity;
                const r = Infinity;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(0);
            });

            test('l < r -> -1', () => {
                const l = 123.45;
                const r = l * 2;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(-1);
            });

            test('l = r -> 0', () => {
                const l = 123.45;
                const r = l;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(0);
            });

            test('l > r -> 1', () => {
                const l = 123.45;
                const r = l / 2;
                const actual = FPN.of(l).compareTo(FPN.of(r));
                expect(actual).toBe(1);
            });
        });

        describe('isEqual method tests', () => {
            test('NaN = n -> false', () => {
                const l = NaN;
                const r = 123.45;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('n = NaN -> false', () => {
                const l = 123.45;
                const r = NaN;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('-Infinity = n -> false', () => {
                const l = -Infinity;
                const r = 123.45;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('+Infinity = n -> false', () => {
                const l = Infinity;
                const r = 123.45;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('n = -Infinity -> false', () => {
                const l = 123.45;
                const r = -Infinity;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('n = +Infinity -> false', () => {
                const l = 123.45;
                const r = +Infinity;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('-Infinity = -Infinity -> true', () => {
                const l = -Infinity;
                const r = -Infinity;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(true);
            });

            test('-Infinity = +Infinity -> false', () => {
                const l = -Infinity;
                const r = Infinity;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('+Infinity = -Infinity -> false', () => {
                const l = Infinity;
                const r = -Infinity;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('+Infinity = +Infinity -> true', () => {
                const l = Infinity;
                const r = Infinity;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(true);
            });

            test('l < r -> false', () => {
                const l = 123.45;
                const r = l * 2;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });

            test('l = r -> true', () => {
                const l = 123.45;
                const r = l;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(true);
            });

            test('l > r -> false', () => {
                const l = 123.45;
                const r = l / 2;
                const actual = FPN.of(l).isEqual(FPN.of(r));
                const expected = BigNumber(l).eq(BigNumber(r));
                expect(actual).toBe(expected);
                expect(actual).toBe(false);
            });
        });
    });

    describe('Construction tests', () => {
        test('of NaN', () => {
            const n = NaN;
            const fpn = FPN.of(n);
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of -Infinity', () => {
            const n = -Infinity;
            const fpn = FPN.of(n);
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of +Infinity', () => {
            const n = Infinity;
            const fpn = FPN.of(n);
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of bigint', () => {
            const bi = Infinity;
            const fpn = FPN.of(bi);
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.toString()).toBe(bi.toString());
        });

        test('of -n', () => {
            const n = -123.0067;
            const fpn = FPN.of(n);
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of +n', () => {
            const n = 123.0067;
            const fpn = FPN.of(n);
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of -n', () => {
            const n = -123.0067;
            const fpn = FPN.of(n);
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of negative string', () => {
            const n = -123.0067;
            const fpn = FPN.of(n.toString());
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.toString()).toBe(n.toString());
        });

        test('of positive string', () => {
            const exp = '+123.45';
            const fpn = FPN.of(exp);
            expect(fpn).toBeInstanceOf(FPN);
            expect(fpn.n).toBe(Number(exp));
        });
    });

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
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(0);
        });

        test('l > r -> 1', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = FPN.of(l).comparedTo(FPN.of(r));
            const expected = BigNumber(l).comparedTo(BigNumber(r));
            expect(actual).toBe(expected);
            expect(actual).toBe(1);
        });
    });

    describe('dp methods', () => {
        test('scale down', () => {
            const fd = 5n;
            const n = 123.45;
            expect(FPN.of(n).dp(fd)).toEqual(FPN.of(n, fd));
        });

        test('scale up', () => {
            const fd = 25n;
            const n = 123.45;
            expect(FPN.of(n).dp(fd)).toEqual(FPN.of(n, fd));
        });
    });

    describe('div method tests', () => {
        test('0/0 = NaN', () => {
            const lr = 0;
            const r = 0;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('NaN / n = ', () => {
            const lr = NaN;
            const r = 123.45;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / NaN = NaN', () => {
            const lr = 123.45;
            const r = NaN;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / -Infinity = 0', () => {
            const lr = 123.45;
            const r = -Infinity;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / +Infinity = 0', () => {
            const lr = 123.45;
            const r = Infinity;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('-n / 0 = -Infinity', () => {
            const lr = -123.45;
            const r = 0;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('+n / 0 = +Infinity', () => {
            const lr = 123.45;
            const r = 0;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('x / y = periodic', () => {
            const lr = -1;
            const r = 3;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('x / y = real', () => {
            const lr = 355;
            const r = 113;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            const dp = 15; // BigNumber default precision diverges after 15 digits.
            expect(actual.n.toFixed(dp)).toBe(expected.toNumber().toFixed(dp));
        });

        test('x / y = integer', () => {
            const lr = 355;
            const r = -5;
            const actual = FPN.of(lr).div(FPN.of(r));
            const expected = BigNumber(lr).div(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
        });

        test('x / 1 = x scale test', () => {
            const l = 123.45;
            const r = 1;
            const actualUp = FPN.of(l, 7n).div(FPN.of(r, 5n));
            const actualDn = FPN.of(l, 5n).div(FPN.of(r, 7n));
            expect(actualUp.isEqual(actualDn)).toBe(true);
            expect(actualUp.isEqual(FPN.of(l))).toBe(true);
        });
    });

    describe('idiv method tests', () => {
        test('0/0 = NaN', () => {
            const l = 0;
            const r = 0;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('NaN / n = ', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / NaN = NaN', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / -Infinity = 0', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / +Infinity = 0', () => {
            const l = 123.45;
            const r = Infinity;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('-n / 0 = -Infinity', () => {
            const l = -123.45;
            const r = 0;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('+n / 0 = +Infinity', () => {
            const l = 123.45;
            const r = 0;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / integer', () => {
            const l = 5;
            const r = 3;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('n / rational', () => {
            const l = 5;
            const r = 0.7;
            const actual = FPN.of(l).idiv(FPN.of(r));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actual.toString()).toBe(expected.toString());
        });

        test('x / 1 = x scale test', () => {
            const l = 123.45;
            const r = 1;
            const actualUp = FPN.of(l, 7n).idiv(FPN.of(r, 5n));
            const actualDn = FPN.of(l, 5n).idiv(FPN.of(r, 7n));
            const expected = BigNumber(l).idiv(BigNumber(r));
            expect(actualUp.isEqual(actualDn)).toBe(true);
            expect(actualDn.n).toBe(expected.toNumber());
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

    describe('isIntegerExpression method tests', () => {
        test('not integer -> false', () => {
            const exp = '123.45';
            expect(FPN.isIntegerExpression(exp)).toBe(false);
        });

        test('negative with - -> true', () => {
            const exp = '-12345';
            expect(FPN.isIntegerExpression(exp)).toBe(true);
        });

        test('positive with + -> true', () => {
            const exp = '+12345';
            expect(FPN.isIntegerExpression(exp)).toBe(true);
        });

        test('positive without + -> true', () => {
            const exp = '12345';
            expect(FPN.isIntegerExpression(exp)).toBe(true);
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

    describe('isNegativeInfinite method tests', () => {
        test('NaN -> false', () => {
            expect(FPN.of(NaN).isNegativeInfinite()).toBe(false);
        });

        test('-Infinite -> true', () => {
            expect(FPN.of(-Infinity).isNegativeInfinite()).toBe(true);
        });

        test('+Infinite -> false', () => {
            expect(FPN.of(Infinity).isNegativeInfinite()).toBe(false);
        });

        test('n -> false', () => {
            expect(FPN.of(-123.45).isNegativeInfinite()).toBe(false);
            expect(FPN.of(0).isNegativeInfinite()).toBe(false);
            expect(FPN.of(123.45).isNegativeInfinite()).toBe(false);
        });
    });

    describe('isPositive method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FPN.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = FPN.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> true', () => {
            const n = Infinity;
            const actual = FPN.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('-n -> false', () => {
            const n = -123.45;
            const actual = FPN.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('0 -> true', () => {
            const n = 0;
            const actual = FPN.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('n -> true', () => {
            const n = 123.45;
            const actual = FPN.of(n).isPositive();
            const expected = BigNumber(n).isPositive();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });
    });

    describe('isPositiveInfinite method tests', () => {
        test('NaN -> false', () => {
            expect(FPN.of(NaN).isPositiveInfinite()).toBe(false);
        });

        test('-Infinite -> false', () => {
            expect(FPN.of(-Infinity).isPositiveInfinite()).toBe(false);
        });

        test('+Infinite -> true', () => {
            expect(FPN.of(Infinity).isPositiveInfinite()).toBe(true);
        });

        test('n -> false', () => {
            expect(FPN.of(-123.45).isPositiveInfinite()).toBe(false);
            expect(FPN.of(0).isPositiveInfinite()).toBe(false);
            expect(FPN.of(123.45).isPositiveInfinite()).toBe(false);
        });
    });

    describe('isZero method tests', () => {
        test('NaN -> false', () => {
            const n = NaN;
            const actual = FPN.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = FPN.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('+Infinite -> false', () => {
            const n = Infinity;
            const actual = FPN.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('-n -> false', () => {
            const n = -123.45;
            const actual = FPN.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(false);
        });

        test('0 -> true', () => {
            const n = 0;
            const actual = FPN.of(n).isZero();
            const expected = BigNumber(n).isZero();
            expect(actual).toBe(expected);
            expect(actual).toBe(true);
        });

        test('+n -> false', () => {
            const n = 123.45;
            const actual = FPN.of(n).isZero();
            const expected = BigNumber(n).isZero();
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
        test('NaN - ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('±n - NaN -> NaN', () => {
            const l = NaN;
            const r = -123.45;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity - -Infinity -> NaN', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity - +Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = +Infinity;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('-Infinity - ±n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
            expect(actual.n).toBe(FPN.of(l).minus(FPN.of(-r)).n);
        });

        test('+Infinity - -Infinity -> +Infinity', () => {
            const l = +Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(+Infinity);
        });

        test('+Infinity - +Infinity -> NaN', () => {
            const l = +Infinity;
            const r = +Infinity;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinity - ±n -> +Infinity', () => {
            const l = +Infinity;
            const r = 123.45;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(+Infinity);
            expect(actual.n).toBe(FPN.of(l).minus(FPN.of(-r)).n);
        });

        test('n - 0 -> n', () => {
            const l = 123.45;
            const r = 0;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.eq(FPN.of(l))).toBe(true);
        });

        test('n - n -> 0 scale test', () => {
            const l = 123.45;
            const r = l;
            const actualUp = FPN.of(l, 7n).minus(FPN.of(r, 5n));
            const actualDn = FPN.of(l, 5n).minus(FPN.of(r, 7n));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actualUp.n).toBe(expected.toNumber());
            expect(actualUp.eq(FPN.ZERO)).toBe(true);
            expect(actualDn.eq(actualUp)).toBe(true);
        });

        test('l - r -> >0', () => {
            const fd = 13;
            const l = 123.45;
            const r = 23.45678;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            expect(actual.n).toBe(l - r);
        });

        test('l - r -> <0', () => {
            const fd = 13;
            const l = 123.45;
            const r = -1234.5678;
            const actual = FPN.of(l).minus(FPN.of(r));
            const expected = BigNumber(l).minus(BigNumber(r));
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            expect(actual.n).toBe(l - r);
        });
    });

    describe('modulo method tests', () => {
        test('NaN % n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('n % NaN -> NaN', () => {
            const l = 123.45;
            const r = NaN;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinite % -Infinite -> NaN', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinite % +Infinite -> NaN', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinite % ±n -> NaN', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinite % -Infinite -> NaN', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinite % +Infinite -> NaN', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinite % ±n -> NaN', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('n % 0 -> 0', () => {
            const l = 123.45;
            const r = 0;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('integer % ±1 -> 0', () => {
            const l = 123;
            const r = 1;
            const actual = FPN.of(l).modulo(FPN.of(r));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actual).toEqual(FPN.of(expected.toNumber()));
            expect(FPN.of(l).modulo(FPN.of(-r))).toEqual(actual);
            expect(actual.isZero()).toBe(true);
        });

        test('n % ±1 -> 0 - scale test', () => {
            const l = 123.45;
            const r = 0.6789;
            const actualUp = FPN.of(l, 7n).modulo(FPN.of(r, 5n));
            const actualDn = FPN.of(l, 5n).modulo(FPN.of(r, 7n));
            const expected = BigNumber(l).modulo(BigNumber(r));
            expect(actualUp.eq(FPN.of(expected.toNumber()))).toBe(true);
            expect(actualUp.eq(actualDn)).toBe(true);
        });
    });

    describe('plus method tests', () => {
        test('NaN + ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('±n + NaN -> NaN', () => {
            const l = NaN;
            const r = -123.45;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity + -Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('-Infinity + +Infinity -> NaN', () => {
            const l = -Infinity;
            const r = +Infinity;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity + ±n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
            expect(actual.n).toBe(FPN.of(l).plus(FPN.of(-r)).n);
        });

        test('+Infinity + -Infinity -> NaN', () => {
            const l = +Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('+Infinity + +Infinity -> Infinity', () => {
            const l = +Infinity;
            const r = +Infinity;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('+Infinity + ±n -> +Infinity', () => {
            const l = +Infinity;
            const r = 123.45;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(+Infinity);
            expect(actual.n).toBe(FPN.of(l).plus(FPN.of(-r)).n);
        });

        test('n + 0 -> n', () => {
            const l = 123.45;
            const r = 0;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.eq(FPN.of(l))).toBe(true);
        });

        test('n + -n -> 0 - scale test', () => {
            const l = 123.45;
            const r = -l;
            const actualUp = FPN.of(l, 7n).plus(FPN.of(r, 5n));
            const actualDn = FPN.of(l, 5n).plus(FPN.of(r, 7n));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actualUp.n).toBe(expected.toNumber());
            expect(actualUp.eq(FPN.ZERO)).toBe(true);
            expect(actualUp.eq(actualDn)).toBe(true);
        });

        test('l + r -> >0', () => {
            const fd = 13;
            const l = 0.1;
            const r = 0.2;
            const actual = FPN.of(l).plus(FPN.of(r));
            const expected = BigNumber(l).plus(BigNumber(r));
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            expect(actual.n).toBe(l + r);
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

        test('b ^ -e - scale test', () => {
            const b = 3;
            const e = -2;
            const actualUp = FPN.of(b, 25n).pow(FPN.of(e, 15n));
            const actualDn = FPN.of(b, 15n).pow(FPN.of(e, 25n));
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
            const actual = FPN.of(b).pow(FPN.of(e));
            const expected = BigNumber(b).pow(BigNumber(e));
            const fd = 14; // Fractional digits before divergence.
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            expect(FPN.of(-b).pow(FPN.of(e))).toEqual(actual);
        });

        test('±b ^ 0 = 1', () => {
            const b = 123.45;
            const e = 0;
            const actual = FPN.of(b).pow(FPN.of(e));
            expect(actual).toEqual(FPN.of(1));
            expect(FPN.of(-b).pow(FPN.of(e))).toEqual(actual);
        });
    });

    describe('sqrt method tests', () => {
        test('√ NaN -> NaN', () => {
            const n = NaN;
            const actual = FPN.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('√ +Infinity -> +Infinity', () => {
            const n = Infinity;
            const actual = FPN.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });
        test('√ -n -> NaN', () => {
            const n = -123.45;
            const actual = FPN.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n).toBe(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('√ n -> integer', () => {
            const n = 16;
            const actual = FPN.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n).toBe(expected.toNumber());
        });

        test('√ n -> rational', () => {
            const fd = 13;
            const n = 3;
            const actual = FPN.of(n).sqrt();
            const expected = BigNumber(n).sqrt();
            expect(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
        });
    });

    describe('times method tests', () => {
        test('NaN * ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('±n * NaN -> NaN', () => {
            const l = -123.45;
            const r = NaN;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(NaN);
        });

        test('-Infinity * -Infinity -> +Infinity', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('-Infinity * +Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('-Infinity * -n -> +Infinity', () => {
            const l = -Infinity;
            const r = -123.45;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('-Infinity * +n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('+Infinity * -Infinity -> -Infinity', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('+Infinity * +Infinity -> +Infinity', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('+Infinity * -n -> -Infinity', () => {
            const l = Infinity;
            const r = -123.45;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(-Infinity);
        });

        test('+Infinity * +n -> +Infinity', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = FPN.of(l).times(FPN.of(r));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actual.n).toEqual(expected.toNumber());
            expect(actual.n).toBe(Infinity);
        });

        test('l * r - scale test', () => {
            const l = 0.6;
            const r = 3;
            const actualUp = FPN.of(l, 7n).times(FPN.of(r, 5n));
            const actualDn = FPN.of(l, 5n).times(FPN.of(r, 7n));
            const expected = BigNumber(l).times(BigNumber(r));
            expect(actualUp.eq(FPN.of(expected.toNumber()))).toBe(true);
            expect(actualUp.eq(actualDn)).toBe(true);
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
