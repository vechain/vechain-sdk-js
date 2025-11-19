"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const bignumber_js_1 = require("bignumber.js");
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Test FixedPointNumber class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('FixedPointNumber class tests', () => {
    (0, globals_1.describe)('VeChain Data Model tests', () => {
        (0, globals_1.describe)('get bi tests', () => {
            (0, globals_1.test)('NaN throws exception', () => {
                (0, globals_1.expect)(() => {
                    // Access the property to trigger the error
                    const property = src_1.FixedPointNumber.NaN.bi;
                    return property; // Return to avoid unused variable warning
                }).toThrow(sdk_errors_1.InvalidOperation);
            });
            (0, globals_1.test)('-Infinity throws exception', () => {
                (0, globals_1.expect)(() => {
                    // Access the property to trigger the error
                    const property = src_1.FixedPointNumber.NEGATIVE_INFINITY.bi;
                    return property; // Return to avoid unused variable warning
                }).toThrow(sdk_errors_1.InvalidOperation);
            });
            (0, globals_1.test)('+Infinity throws exception', () => {
                (0, globals_1.expect)(() => {
                    // Access the property to trigger the error
                    const property = src_1.FixedPointNumber.POSITIVE_INFINITY.bi;
                    return property; // Return to avoid unused variable warning
                }).toThrow(sdk_errors_1.InvalidOperation);
            });
            (0, globals_1.test)('Integers result the same', () => {
                const expected = 12345n;
                const actual = src_1.FixedPointNumber.of(expected).bi;
                (0, globals_1.expect)(actual).toEqual(expected);
            });
            (0, globals_1.test)('Rational is truncated', () => {
                const n = 123.45;
                const actual = src_1.FixedPointNumber.of(n).bi;
                const expected = BigInt(Math.trunc(n));
                (0, globals_1.expect)(actual).toEqual(expected);
            });
        });
        (0, globals_1.test)('get bytes tests', () => {
            const exp = src_1.Txt.of('123.45');
            const actual = src_1.FixedPointNumber.of(exp.toString()).bytes;
            const expected = exp.bytes;
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        (0, globals_1.describe)('get n tests', () => {
            (0, globals_1.test)('NaN', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.NaN.n).toEqual(NaN);
            });
            (0, globals_1.test)('-Infinity', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.n).toEqual(-Infinity);
            });
            (0, globals_1.test)('+Infinity', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.n).toEqual(Infinity);
            });
            (0, globals_1.test)('±n', () => {
                const n = 123.45;
                (0, globals_1.expect)(src_1.FixedPointNumber.of(n).n).toBeCloseTo(n);
                (0, globals_1.expect)(src_1.FixedPointNumber.of(-n).n).toBeCloseTo(-n);
            });
        });
        (0, globals_1.describe)('compareTo tests', () => {
            (0, globals_1.test)('NaN ~ n throws exception', () => {
                const l = NaN;
                const r = 123.45;
                (0, globals_1.expect)(() => src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r))).toThrow(sdk_errors_1.InvalidOperation);
            });
            (0, globals_1.test)('n ~ NaN -> throw exception', () => {
                const l = 123.45;
                const r = NaN;
                (0, globals_1.expect)(() => src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r))).toThrow(sdk_errors_1.InvalidOperation);
            });
            (0, globals_1.test)('-Infinity ~ n -> -1', () => {
                const l = -Infinity;
                const r = 123.45;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(-1);
            });
            (0, globals_1.test)('+Infinity ~ n -> 1', () => {
                const l = Infinity;
                const r = 123.45;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(1);
            });
            (0, globals_1.test)('n ~ -Infinity -> 1', () => {
                const l = 123.45;
                const r = -Infinity;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(1);
            });
            (0, globals_1.test)('n ~ +Infinity -> -1', () => {
                const l = 123.45;
                const r = +Infinity;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(-1);
            });
            (0, globals_1.test)('-Infinity ~ -Infinity -> 0', () => {
                const l = -Infinity;
                const r = -Infinity;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(0);
            });
            (0, globals_1.test)('-Infinity ~ +Infinity -> -1', () => {
                const l = -Infinity;
                const r = Infinity;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(-1);
            });
            (0, globals_1.test)('+Infinity ~ -Infinity -> 1', () => {
                const l = Infinity;
                const r = -Infinity;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(1);
            });
            (0, globals_1.test)('+Infinity ~ +Infinity -> 0', () => {
                const l = Infinity;
                const r = Infinity;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(0);
            });
            (0, globals_1.test)('l < r -> -1', () => {
                const l = 123.45;
                const r = l * 2;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(-1);
            });
            (0, globals_1.test)('l = r -> 0', () => {
                const l = 123.45;
                const r = l;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(0);
            });
            (0, globals_1.test)('l > r -> 1', () => {
                const l = 123.45;
                const r = l / 2;
                const actual = src_1.FixedPointNumber.of(l).compareTo(src_1.FixedPointNumber.of(r));
                (0, globals_1.expect)(actual).toBe(1);
            });
        });
        (0, globals_1.describe)('isEqual method tests', () => {
            (0, globals_1.test)('NaN = n -> false', () => {
                const l = NaN;
                const r = 123.45;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('n = NaN -> false', () => {
                const l = 123.45;
                const r = NaN;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('-Infinity = n -> false', () => {
                const l = -Infinity;
                const r = 123.45;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('+Infinity = n -> false', () => {
                const l = Infinity;
                const r = 123.45;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('n = -Infinity -> false', () => {
                const l = 123.45;
                const r = -Infinity;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('n = +Infinity -> false', () => {
                const l = 123.45;
                const r = +Infinity;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('-Infinity = -Infinity -> true', () => {
                const l = -Infinity;
                const r = -Infinity;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(true);
            });
            (0, globals_1.test)('-Infinity = +Infinity -> false', () => {
                const l = -Infinity;
                const r = Infinity;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('+Infinity = -Infinity -> false', () => {
                const l = Infinity;
                const r = -Infinity;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('+Infinity = +Infinity -> true', () => {
                const l = Infinity;
                const r = Infinity;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(true);
            });
            (0, globals_1.test)('l < r -> false', () => {
                const l = 123.45;
                const r = l * 2;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
            (0, globals_1.test)('l = r -> true', () => {
                const l = 123.45;
                const r = l;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(true);
            });
            (0, globals_1.test)('l > r -> false', () => {
                const l = 123.45;
                const r = l / 2;
                const actual = src_1.FixedPointNumber.of(l).isEqual(src_1.FixedPointNumber.of(r));
                const expected = (0, bignumber_js_1.BigNumber)(l).eq((0, bignumber_js_1.BigNumber)(r));
                (0, globals_1.expect)(actual).toBe(expected);
                (0, globals_1.expect)(actual).toBe(false);
            });
        });
    });
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('of NaN', () => {
            const n = NaN;
            const actual = src_1.FixedPointNumber.of(n);
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.n).toBe(n);
        });
        (0, globals_1.test)('of -Infinity', () => {
            const n = -Infinity;
            const actual = src_1.FixedPointNumber.of(n);
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.n).toBe(n);
        });
        (0, globals_1.test)('of +Infinity', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n);
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.n).toBe(n);
        });
        (0, globals_1.test)('of -bigint', () => {
            const bi = -12345678901234567890n;
            const actual = src_1.FixedPointNumber.of(bi);
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.bi).toBe(bi);
        });
        (0, globals_1.test)('of +bigint', () => {
            const bi = 12345678901234567890n;
            const actual = src_1.FixedPointNumber.of(bi);
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.bi).toBe(bi);
        });
        (0, globals_1.test)('of FixedPointNumber', () => {
            const expected = src_1.FixedPointNumber.of(-123.45);
            const actual = src_1.FixedPointNumber.of(expected);
            (0, globals_1.expect)(actual.isEqual(expected)).toBe(true);
        });
        (0, globals_1.test)('of +n', () => {
            const n = 123.0067;
            const actual = src_1.FixedPointNumber.of(n);
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.n).toBeCloseTo(n);
        });
        (0, globals_1.test)('of -n', () => {
            const n = -123.0067;
            const actual = src_1.FixedPointNumber.of(n);
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.n).toBeCloseTo(n);
        });
        (0, globals_1.test)('of negative string', () => {
            const n = '-123.0067';
            const actual = src_1.FixedPointNumber.of(n.toString());
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.n).toBeCloseTo(Number(n));
        });
        (0, globals_1.test)('of positive string', () => {
            const exp = '+123.45';
            const actual = src_1.FixedPointNumber.of(exp);
            (0, globals_1.expect)(actual).toBeInstanceOf(src_1.FixedPointNumber);
            (0, globals_1.expect)(actual.n).toBeCloseTo(Number(exp));
        });
        (0, globals_1.test)('of an illegal expression throws exception', () => {
            const exp = 'abracadabra';
            (0, globals_1.expect)(() => src_1.FixedPointNumber.of(exp)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('abs method tests', () => {
        (0, globals_1.test)('NaN -> Nan', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NaN.abs().isNaN()).toBe(true);
        });
        (0, globals_1.test)('-Infinite -> +Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.abs().isPositiveInfinite()).toBe(true);
        });
        (0, globals_1.test)('+Infinite -> +Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.abs().isPositiveInfinite()).toBe(true);
        });
        (0, globals_1.test)('n < 0', () => {
            const n = -0.8;
            const actual = src_1.FixedPointNumber.of(n).abs();
            const expected = (0, bignumber_js_1.BigNumber)(n).abs();
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('n > 0', () => {
            const n = 0.8;
            const actual = src_1.FixedPointNumber.of(n).abs();
            const expected = (0, bignumber_js_1.BigNumber)(n).abs();
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
    });
    (0, globals_1.describe)('comparedTo method tests', () => {
        (0, globals_1.test)('NaN ~ n -> null', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(null);
        });
        (0, globals_1.test)('n ~ NaN -> null', () => {
            const l = 123.45;
            const r = NaN;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
        });
        (0, globals_1.test)('-Infinity ~ n -> -1', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(-1);
        });
        (0, globals_1.test)('+Infinity ~ n -> 1', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(1);
        });
        (0, globals_1.test)('n ~ -Infinity -> 1', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(1);
        });
        (0, globals_1.test)('n ~ +Infinity -> -1', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(-1);
        });
        (0, globals_1.test)('-Infinity ~ -Infinity -> 0', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(0);
        });
        (0, globals_1.test)('-Infinity ~ +Infinity -> -1', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(-1);
        });
        (0, globals_1.test)('+Infinity ~ -Infinity -> 1', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(1);
        });
        (0, globals_1.test)('+Infinity ~ +Infinity -> 0', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(0);
        });
        (0, globals_1.test)('l < r -> -1', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(-1);
        });
        (0, globals_1.test)('l = r -> 0', () => {
            const l = 123.45;
            const r = l;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(0);
        });
        (0, globals_1.test)('l > r -> 1', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = src_1.FixedPointNumber.of(l).comparedTo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).comparedTo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(1);
        });
    });
    (0, globals_1.describe)('dp methods', () => {
        (0, globals_1.test)('scale down', () => {
            const fd = 5n;
            const n = 123.45;
            const expected = src_1.FixedPointNumber.of(n);
            const actual = src_1.FixedPointNumber.of(n).dp(fd);
            (0, globals_1.expect)(actual.isEqual(expected)).toBe(true);
        });
        (0, globals_1.test)('scale up', () => {
            const fd = 25n;
            const n = 123.45;
            const expected = src_1.FixedPointNumber.of(n);
            const actual = src_1.FixedPointNumber.of(n).dp(fd);
            (0, globals_1.expect)(actual.isEqual(expected)).toBe(true);
        });
        (0, globals_1.test)(' scale negative -> err', () => {
            (0, globals_1.expect)(() => {
                src_1.FixedPointNumber.of(123.45).dp(-1n);
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('div method tests', () => {
        (0, globals_1.test)('0/0 = NaN', () => {
            const lr = 0;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(lr).div(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(lr).div((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('NaN / n = ', () => {
            const lr = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(lr).div(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(lr).div((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('-Infinite / ±Infinite -> NaN', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.div(src_1.FixedPointNumber.NEGATIVE_INFINITY).isNaN()).toBe(true);
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.div(src_1.FixedPointNumber.POSITIVE_INFINITY).isNaN()).toBe(true);
        });
        (0, globals_1.test)('-Infinite / -n -> +Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.div(src_1.FixedPointNumber.of(-123.45)).isPositiveInfinite()).toBe(true);
        });
        (0, globals_1.test)('-Infinite / +n -> -Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.div(src_1.FixedPointNumber.of(123.45)).isNegativeInfinite()).toBe(true);
        });
        (0, globals_1.test)('+Infinite / ±Infinite -> NaN', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.div(src_1.FixedPointNumber.NEGATIVE_INFINITY).isNaN()).toBe(true);
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.div(src_1.FixedPointNumber.POSITIVE_INFINITY).isNaN()).toBe(true);
        });
        (0, globals_1.test)('+Infinite / -n -> -Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.div(src_1.FixedPointNumber.of(-123.45)).isNegativeInfinite()).toBe(true);
        });
        (0, globals_1.test)('+Infinite / +n -> +Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.div(src_1.FixedPointNumber.of(+123.45)).isPositiveInfinite()).toBe(true);
        });
        (0, globals_1.test)('n / NaN = NaN', () => {
            const x = src_1.FixedPointNumber.of(123.45);
            const y = src_1.FixedPointNumber.of(NaN);
            const actual = x.div(y);
            const expected = (0, bignumber_js_1.BigNumber)(x.n).div((0, bignumber_js_1.BigNumber)(y.n));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('n / -Infinity = 0', () => {
            const lr = 123.45;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(lr).div(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(lr).div((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('n / +Infinity = 0', () => {
            const lr = 123.45;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(lr).div(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(lr).div((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('-n / 0 = -Infinity', () => {
            const lr = -123.45;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(lr).div(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(lr).div((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('+n / 0 = +Infinity', () => {
            const lr = 123.45;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(lr).div(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(lr).div((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('x / y = periodic', () => {
            const x = src_1.FixedPointNumber.of(-1);
            const y = src_1.FixedPointNumber.of(3);
            const actual = x.div(y);
            const expected = (0, bignumber_js_1.BigNumber)(x.n).div((0, bignumber_js_1.BigNumber)(y.n));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('x / y = real', () => {
            const x = src_1.FixedPointNumber.of(355);
            const y = src_1.FixedPointNumber.of(113);
            const actual = x.div(y);
            const expected = (0, bignumber_js_1.BigNumber)(x.n).div((0, bignumber_js_1.BigNumber)(y.n));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('x / y = integer', () => {
            const x = src_1.FixedPointNumber.of(355);
            const y = src_1.FixedPointNumber.of(-5);
            const actual = x.div(y);
            const expected = (0, bignumber_js_1.BigNumber)(x.n).div((0, bignumber_js_1.BigNumber)(y.n));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('x / 1 = x scale test', () => {
            const x = 123.45;
            const y = 1;
            const actualUp = src_1.FixedPointNumber.of(x, 7n).div(src_1.FixedPointNumber.of(y, 5n));
            const actualDn = src_1.FixedPointNumber.of(x, 5n).div(src_1.FixedPointNumber.of(y, 7n));
            (0, globals_1.expect)(actualUp.isEqual(actualDn)).toBe(true);
            (0, globals_1.expect)(actualUp.isEqual(src_1.FixedPointNumber.of(x))).toBe(true);
        });
    });
    (0, globals_1.describe)('idiv method tests', () => {
        (0, globals_1.test)('0/0 = NaN', () => {
            const l = 0;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('NaN / n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('-Infinite / ±Infinite -> NaN', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.idiv(src_1.FixedPointNumber.NEGATIVE_INFINITY).isNaN()).toBe(true);
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.idiv(src_1.FixedPointNumber.POSITIVE_INFINITY).isNaN()).toBe(true);
        });
        (0, globals_1.test)('-Infinite / -n -> +Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.idiv(src_1.FixedPointNumber.of(-123.45)).isPositiveInfinite()).toBe(true);
        });
        (0, globals_1.test)('-Infinite / +n -> -Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.idiv(src_1.FixedPointNumber.of(123.45)).isNegativeInfinite()).toBe(true);
        });
        (0, globals_1.test)('+Infinite / ±Infinite -> NaN', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.idiv(src_1.FixedPointNumber.NEGATIVE_INFINITY).isNaN()).toBe(true);
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.idiv(src_1.FixedPointNumber.POSITIVE_INFINITY).isNaN()).toBe(true);
        });
        (0, globals_1.test)('+Infinite / -n -> -Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.idiv(src_1.FixedPointNumber.of(-123.45)).isNegativeInfinite()).toBe(true);
        });
        (0, globals_1.test)('+Infinite / +n -> +Infinite', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.idiv(src_1.FixedPointNumber.of(123.45)).isPositiveInfinite()).toBe(true);
        });
        (0, globals_1.test)('n / NaN = NaN', () => {
            const l = 123.45;
            const r = NaN;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('n / -Infinity = 0', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('n / +Infinity = 0', () => {
            const l = 123.45;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('-n / 0 = -Infinity', () => {
            const l = -123.45;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('+n / 0 = +Infinity', () => {
            const l = 123.45;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('n / integer', () => {
            const l = 5;
            const r = 3;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('n / rational', () => {
            const l = 5;
            const r = 0.7;
            const actual = src_1.FixedPointNumber.of(l).idiv(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).idiv((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('x / 1 = x scale test', () => {
            const x = 123.45;
            const y = 1;
            const actualUp = src_1.FixedPointNumber.of(x, 7n).idiv(src_1.FixedPointNumber.of(y, 5n));
            const actualDn = src_1.FixedPointNumber.of(x, 5n).idiv(src_1.FixedPointNumber.of(y, 7n));
            const expected = (0, bignumber_js_1.BigNumber)(x).idiv((0, bignumber_js_1.BigNumber)(y));
            (0, globals_1.expect)(actualUp.isEqual(actualDn)).toBe(true);
            (0, globals_1.expect)(actualUp.n).toBeCloseTo(expected.toNumber());
        });
    });
    (0, globals_1.describe)('gt method tests', () => {
        (0, globals_1.test)('NaN > n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n > NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinity > n -> false', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinity > n -> true', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('n > -Infinity -> true', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('n > +Infinity -> false', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinity > -Infinity -> false', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinity > +Infinity -> false', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinity > -Infinity -> true', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+Infinity > +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('l < r -> false', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('l = r -> false', () => {
            const l = 123.45;
            const r = l;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('l > r -> true', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = src_1.FixedPointNumber.of(l).gt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
    });
    (0, globals_1.describe)('gte method tests', () => {
        (0, globals_1.test)('NaN > n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
        });
        (0, globals_1.test)('n > NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinity > n -> false', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinity > n -> true', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('n > -Infinity -> true', () => {
            const l = 123.45;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('n > +Infinity -> false', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinity > -Infinity -> true', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('-Infinity > +Infinity -> false', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinity > -Infinity -> true', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+Infinity > +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('l < r -> false', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('l = r -> true', () => {
            const l = 123.45;
            const r = l;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('l > r -> true', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = src_1.FixedPointNumber.of(l).gte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).gte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
    });
    (0, globals_1.describe)('isFinite method tests', () => {
        (0, globals_1.test)('NaN -> false', () => {
            const n = NaN;
            const actual = src_1.FixedPointNumber.of(n).isFinite();
            const expected = (0, bignumber_js_1.BigNumber)(n).isFinite();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = src_1.FixedPointNumber.of(n).isFinite();
            const expected = (0, bignumber_js_1.BigNumber)(n).isFinite();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinite -> false', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n).isFinite();
            const expected = (0, bignumber_js_1.BigNumber)(n).isFinite();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n -> true', () => {
            const n = 123.45;
            const actual = src_1.FixedPointNumber.of(n).isFinite();
            const expected = (0, bignumber_js_1.BigNumber)(n).isFinite();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
    });
    (0, globals_1.describe)(`isInfinite method tests`, () => {
        (0, globals_1.test)('NaN -> false', () => {
            const actual = src_1.FixedPointNumber.of(NaN).isInfinite();
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinite -> true', () => {
            const n = -Infinity;
            const actual = src_1.FixedPointNumber.of(n).isInfinite();
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+Infinite -> true', () => {
            const actual = src_1.FixedPointNumber.of(Infinity).isInfinite();
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('n -> false', () => {
            const n = 0;
            const actual = src_1.FixedPointNumber.of(n).isInfinite();
            (0, globals_1.expect)(actual).toBe(false);
        });
    });
    (0, globals_1.describe)('isInteger method tests', () => {
        (0, globals_1.test)('NaN -> false', () => {
            const n = NaN;
            const actual = src_1.FixedPointNumber.of(n).isInteger();
            const expected = (0, bignumber_js_1.BigNumber)(n).isInteger();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinite -> false', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n).isInteger();
            const expected = (0, bignumber_js_1.BigNumber)(n).isInteger();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinite -> false', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n).isInteger();
            const expected = (0, bignumber_js_1.BigNumber)(n).isInteger();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('not integer -> false', () => {
            const n = 123.45;
            const actual = src_1.FixedPointNumber.of(n).isInteger();
            const expected = (0, bignumber_js_1.BigNumber)(n).isInteger();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('integer -> true', () => {
            const n = 12345;
            const actual = src_1.FixedPointNumber.of(n).isInteger();
            const expected = (0, bignumber_js_1.BigNumber)(n).isInteger();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
    });
    (0, globals_1.describe)('isIntegerExpression method tests', () => {
        (0, globals_1.test)('not integer -> false', () => {
            const exp = '123.45';
            (0, globals_1.expect)(src_1.FixedPointNumber.isIntegerExpression(exp)).toBe(false);
        });
        (0, globals_1.test)('negative with - -> true', () => {
            const exp = '-12345';
            (0, globals_1.expect)(src_1.FixedPointNumber.isIntegerExpression(exp)).toBe(true);
        });
        (0, globals_1.test)('positive with + -> true', () => {
            const exp = '+12345';
            (0, globals_1.expect)(src_1.FixedPointNumber.isIntegerExpression(exp)).toBe(true);
        });
        (0, globals_1.test)('positive without + -> true', () => {
            const exp = '12345';
            (0, globals_1.expect)(src_1.FixedPointNumber.isIntegerExpression(exp)).toBe(true);
        });
    });
    (0, globals_1.describe)(`isNaN method tests`, () => {
        (0, globals_1.test)('NaN -> true', () => {
            const n = NaN;
            const actual = src_1.FixedPointNumber.of(n).isNaN();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNaN();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = src_1.FixedPointNumber.of(n).isNaN();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNaN();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinite -> false', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n).isNaN();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNaN();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('finite -> false', () => {
            const n = 0;
            const actual = src_1.FixedPointNumber.of(n).isNaN();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNaN();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
    });
    (0, globals_1.describe)('isNegative method tests', () => {
        (0, globals_1.test)('NaN -> false', () => {
            const n = NaN;
            const actual = src_1.FixedPointNumber.of(n).isNegative();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNegative();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinite -> true', () => {
            const n = -Infinity;
            const actual = src_1.FixedPointNumber.of(n).isNegative();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNegative();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+Infinite -> false', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n).isNegative();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNegative();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-n -> true', () => {
            const n = -123.45;
            const actual = src_1.FixedPointNumber.of(n).isNegative();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNegative();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('0 -> false', () => {
            const n = 0;
            const actual = src_1.FixedPointNumber.of(n).isNegative();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNegative();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n -> false', () => {
            const n = 123.45;
            const actual = src_1.FixedPointNumber.of(n).isNegative();
            const expected = (0, bignumber_js_1.BigNumber)(n).isNegative();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
    });
    (0, globals_1.describe)('isNegativeInfinite method tests', () => {
        (0, globals_1.test)('NaN -> false', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.of(NaN).isNegativeInfinite()).toBe(false);
        });
        (0, globals_1.test)('-Infinite -> true', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.of(-Infinity).isNegativeInfinite()).toBe(true);
        });
        (0, globals_1.test)('+Infinite -> false', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.of(Infinity).isNegativeInfinite()).toBe(false);
        });
        (0, globals_1.test)('n -> false', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.of(-123.45).isNegativeInfinite()).toBe(false);
            (0, globals_1.expect)(src_1.FixedPointNumber.of(0).isNegativeInfinite()).toBe(false);
            (0, globals_1.expect)(src_1.FixedPointNumber.of(123.45).isNegativeInfinite()).toBe(false);
        });
    });
    (0, globals_1.describe)('isNumberExpression method tests', () => {
        (0, globals_1.describe)('Return true', () => {
            (0, globals_1.test)('±natural -> true', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('0')).toBe(true);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('-1.5')).toBe(true);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('+1')).toBe(true);
            });
            (0, globals_1.test)('±rational -> true', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('-32412341234.543563463')).toBe(true);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1.54523532463463642352342354645363')).toBe(true);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('+123.45')).toBe(true);
            });
            (0, globals_1.test)('±|0 < n < 1| without `0` prefix -> true', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('.52434234')).toBe(true);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('-.52434234')).toBe(true);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('+.52434234')).toBe(true);
            });
        });
        (0, globals_1.describe)('Return false', () => {
            (0, globals_1.test)('empty -> false', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('')).toBeFalsy();
            });
            (0, globals_1.test)('dot only -> false', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('.')).toBe(false);
            });
            (0, globals_1.test)('dot without fractional part -> false', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1.')).toBe(false);
            });
            (0, globals_1.test)('illegal char -> false', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1,6')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1,6,7')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1.6,7')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1.6,7')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1,6.7')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1,6,7.8')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('0x152')).toBe(false);
            });
            (0, globals_1.test)('multiple dots', () => {
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1.6.')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1.6.7')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('1.6.7.')).toBe(false);
                (0, globals_1.expect)(src_1.FixedPointNumber.isNumberExpression('-1.5.6')).toBe(false);
            });
        });
    });
    (0, globals_1.describe)('isPositive method tests', () => {
        (0, globals_1.test)('NaN -> false', () => {
            const n = NaN;
            const actual = src_1.FixedPointNumber.of(n).isPositive();
            const expected = (0, bignumber_js_1.BigNumber)(n).isPositive();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = src_1.FixedPointNumber.of(n).isPositive();
            const expected = (0, bignumber_js_1.BigNumber)(n).isPositive();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinite -> true', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n).isPositive();
            const expected = (0, bignumber_js_1.BigNumber)(n).isPositive();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('-n -> false', () => {
            const n = -123.45;
            const actual = src_1.FixedPointNumber.of(n).isPositive();
            const expected = (0, bignumber_js_1.BigNumber)(n).isPositive();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('0 -> true', () => {
            const n = 0;
            const actual = src_1.FixedPointNumber.of(n).isPositive();
            const expected = (0, bignumber_js_1.BigNumber)(n).isPositive();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('n -> true', () => {
            const n = 123.45;
            const actual = src_1.FixedPointNumber.of(n).isPositive();
            const expected = (0, bignumber_js_1.BigNumber)(n).isPositive();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
    });
    (0, globals_1.describe)('isPositiveInfinite method tests', () => {
        (0, globals_1.test)('NaN -> false', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.of(NaN).isPositiveInfinite()).toBe(false);
        });
        (0, globals_1.test)('-Infinite -> false', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.of(-Infinity).isPositiveInfinite()).toBe(false);
        });
        (0, globals_1.test)('+Infinite -> true', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.of(Infinity).isPositiveInfinite()).toBe(true);
        });
        (0, globals_1.test)('n -> false', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.of(-123.45).isPositiveInfinite()).toBe(false);
            (0, globals_1.expect)(src_1.FixedPointNumber.of(0).isPositiveInfinite()).toBe(false);
            (0, globals_1.expect)(src_1.FixedPointNumber.of(123.45).isPositiveInfinite()).toBe(false);
        });
    });
    (0, globals_1.describe)('isNaturalExpression method tests', () => {
        (0, globals_1.test)('not integer -> false', () => {
            const exp = '123.45';
            (0, globals_1.expect)(src_1.FixedPointNumber.isNaturalExpression(exp)).toBe(false);
        });
        (0, globals_1.test)('negative with - -> false', () => {
            const exp = '-12345';
            (0, globals_1.expect)(src_1.FixedPointNumber.isNaturalExpression(exp)).toBe(false);
        });
        (0, globals_1.test)('positive with + -> false', () => {
            const exp = '+12345';
            (0, globals_1.expect)(src_1.FixedPointNumber.isNaturalExpression(exp)).toBe(false);
        });
        (0, globals_1.test)('positive without + -> true', () => {
            const exp = '12345';
            (0, globals_1.expect)(src_1.FixedPointNumber.isNaturalExpression(exp)).toBe(true);
        });
    });
    (0, globals_1.describe)('isZero method tests', () => {
        (0, globals_1.test)('NaN -> false', () => {
            const n = NaN;
            const actual = src_1.FixedPointNumber.of(n).isZero();
            const expected = (0, bignumber_js_1.BigNumber)(n).isZero();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinite -> false', () => {
            const n = -Infinity;
            const actual = src_1.FixedPointNumber.of(n).isZero();
            const expected = (0, bignumber_js_1.BigNumber)(n).isZero();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinite -> false', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n).isZero();
            const expected = (0, bignumber_js_1.BigNumber)(n).isZero();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-n -> false', () => {
            const n = -123.45;
            const actual = src_1.FixedPointNumber.of(n).isZero();
            const expected = (0, bignumber_js_1.BigNumber)(n).isZero();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('0 -> true', () => {
            const n = 0;
            const actual = src_1.FixedPointNumber.of(n).isZero();
            const expected = (0, bignumber_js_1.BigNumber)(n).isZero();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+n -> false', () => {
            const n = 123.45;
            const actual = src_1.FixedPointNumber.of(n).isZero();
            const expected = (0, bignumber_js_1.BigNumber)(n).isZero();
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
    });
    (0, globals_1.describe)('lt method tests', () => {
        (0, globals_1.test)('NaN < n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n < NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinity < n -> true', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+Infinity < n -> false', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n < -Infinity -> false', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n < +Infinity -> true', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('-Infinity < -Infinity -> false', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinity < +Infinity -> true', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+Infinity < -Infinity -> false', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinity < +Infinity -> false', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('l < r -> true', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('l = r -> false', () => {
            const l = 123.45;
            const r = l;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('l > r -> false', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = src_1.FixedPointNumber.of(l).lt(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lt((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
    });
    (0, globals_1.describe)('lte method tests', () => {
        (0, globals_1.test)('NaN < n -> false', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n < NaN -> false', () => {
            const l = 123.45;
            const r = NaN;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('-Infinity < n -> true', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+Infinity < n -> false', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n < -Infinity -> false', () => {
            const l = -123.45;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('n < +Infinity -> true', () => {
            const l = 123.45;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('-Infinity < -Infinity -> true', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('-Infinity < +Infinity -> true', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('+Infinity < -Infinity -> false', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
        (0, globals_1.test)('+Infinity < +Infinity -> true', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('l < r -> true', () => {
            const l = 123.45;
            const r = l * 2;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('l = r -> true', () => {
            const l = 123.45;
            const r = l;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(true);
        });
        (0, globals_1.test)('l > r -> false', () => {
            const l = 123.45;
            const r = l / 2;
            const actual = src_1.FixedPointNumber.of(l).lte(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).lte((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual).toBe(expected);
            (0, globals_1.expect)(actual).toBe(false);
        });
    });
    (0, globals_1.describe)('minus method tests', () => {
        (0, globals_1.test)('NaN - ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('±n - NaN -> NaN', () => {
            const l = NaN;
            const r = -123.45;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinity - -Infinity -> NaN', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinity - +Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(-Infinity);
        });
        (0, globals_1.test)('-Infinity - ±n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(-Infinity);
            (0, globals_1.expect)(actual.n).toBe(src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(-r)).n);
        });
        (0, globals_1.test)('+Infinity - -Infinity -> +Infinity', () => {
            const l = +Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(+Infinity);
        });
        (0, globals_1.test)('+Infinity - +Infinity -> NaN', () => {
            const l = +Infinity;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('+Infinity - ±n -> +Infinity', () => {
            const l = +Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(+Infinity);
            (0, globals_1.expect)(actual.n).toBe(src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(-r)).n);
        });
        (0, globals_1.test)('n - 0 -> n', () => {
            const l = 123.45;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
            (0, globals_1.expect)(actual.eq(src_1.FixedPointNumber.of(l))).toBe(true);
        });
        (0, globals_1.test)('n - n -> 0 scale test', () => {
            const l = 123.45;
            const r = l;
            const actualUp = src_1.FixedPointNumber.of(l, 7n).minus(src_1.FixedPointNumber.of(r, 5n));
            const actualDn = src_1.FixedPointNumber.of(l, 5n).minus(src_1.FixedPointNumber.of(r, 7n));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actualUp.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actualUp.eq(src_1.FixedPointNumber.ZERO)).toBe(true);
            (0, globals_1.expect)(actualDn.eq(actualUp)).toBe(true);
        });
        (0, globals_1.test)('l - r -> >0', () => {
            const l = 123.45;
            const r = 23.45678;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('l - r -> <0', () => {
            const l = 123.45;
            const r = -1234.5678;
            const actual = src_1.FixedPointNumber.of(l).minus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).minus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
    });
    (0, globals_1.describe)('modulo method tests', () => {
        (0, globals_1.test)('NaN % n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('n % NaN -> NaN', () => {
            const l = 123.45;
            const r = NaN;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinite % -Infinite -> NaN', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinite % +Infinite -> NaN', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinite % ±n -> NaN', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('+Infinite % -Infinite -> NaN', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('+Infinite % +Infinite -> NaN', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('+Infinite % ±n -> NaN', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('n % 0 -> 0', () => {
            const l = 123.45;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('integer % ±1 -> 0', () => {
            const l = 123;
            const r = 1;
            const actual = src_1.FixedPointNumber.of(l).modulo(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('n % ±1 -> 0 - scale test', () => {
            const l = 123.45;
            const r = 0.6789;
            const actualUp = src_1.FixedPointNumber.of(l, 7n).modulo(src_1.FixedPointNumber.of(r, 5n));
            const actualDn = src_1.FixedPointNumber.of(l, 5n).modulo(src_1.FixedPointNumber.of(r, 7n));
            const expected = (0, bignumber_js_1.BigNumber)(l).modulo((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actualUp.eq(src_1.FixedPointNumber.of(expected.toNumber()))).toBe(true);
            (0, globals_1.expect)(actualUp.eq(actualDn)).toBe(true);
        });
    });
    (0, globals_1.describe)('negated', () => {
        (0, globals_1.test)('NaN -> NaN', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NaN.negated().isNaN()).toBe(true);
        });
        (0, globals_1.test)('-Infinity -> +Infinity', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.NEGATIVE_INFINITY.negated().isEqual(src_1.FixedPointNumber.POSITIVE_INFINITY)).toBe(true);
        });
        (0, globals_1.test)('+Infinity -> -Infinity', () => {
            (0, globals_1.expect)(src_1.FixedPointNumber.POSITIVE_INFINITY.negated().isEqual(src_1.FixedPointNumber.NEGATIVE_INFINITY)).toBe(true);
        });
        (0, globals_1.test)('±0 -> ±0', () => {
            const n = src_1.FixedPointNumber.ZERO;
            (0, globals_1.expect)(n.negated().isEqual(n)).toBe(true);
        });
        (0, globals_1.test)('±n -> ±n', () => {
            const n = -123.45;
            // eslint-disable-next-line sonarjs/no-incomplete-assertions
            (0, globals_1.expect)(src_1.FixedPointNumber.of(n)
                .negated()
                .isEqual(src_1.FixedPointNumber.of(-n)));
        });
    });
    (0, globals_1.describe)('plus method tests', () => {
        (0, globals_1.test)('NaN + ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('±n + NaN -> NaN', () => {
            const l = NaN;
            const r = -123.45;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinity + -Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(-Infinity);
        });
        (0, globals_1.test)('-Infinity + +Infinity -> NaN', () => {
            const l = -Infinity;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinity + ±n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(-Infinity);
            (0, globals_1.expect)(actual.n).toBe(src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(-r)).n);
        });
        (0, globals_1.test)('+Infinity + -Infinity -> NaN', () => {
            const l = +Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('+Infinity + +Infinity -> Infinity', () => {
            const l = +Infinity;
            const r = +Infinity;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(Infinity);
        });
        (0, globals_1.test)('+Infinity + ±n -> +Infinity', () => {
            const l = +Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(+Infinity);
            (0, globals_1.expect)(actual.n).toBe(src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(-r)).n);
        });
        (0, globals_1.test)('n + 0 -> n', () => {
            const l = 123.45;
            const r = 0;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
            (0, globals_1.expect)(actual.eq(src_1.FixedPointNumber.of(l))).toBe(true);
        });
        (0, globals_1.test)('n + -n -> 0 - scale test', () => {
            const l = 123.45;
            const r = -l;
            const actualUp = src_1.FixedPointNumber.of(l, 7n).plus(src_1.FixedPointNumber.of(r, 5n));
            const actualDn = src_1.FixedPointNumber.of(l, 5n).plus(src_1.FixedPointNumber.of(r, 7n));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actualUp.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actualUp.eq(src_1.FixedPointNumber.ZERO)).toBe(true);
            (0, globals_1.expect)(actualUp.eq(actualDn)).toBe(true);
        });
        (0, globals_1.test)('l + r -> >0', () => {
            const fd = 13;
            const l = 0.1;
            const r = 0.2;
            const actual = src_1.FixedPointNumber.of(l).plus(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).plus((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
            (0, globals_1.expect)(actual.n).toBeCloseTo(l + r);
        });
    });
    (0, globals_1.describe)('pow method tests', () => {
        (0, globals_1.test)('NaN ^ -e', () => {
            const b = NaN;
            const e = -123.45;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('NaN ^ +e', () => {
            const b = NaN;
            const e = 123.45;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('-b ^ NaN', () => {
            const b = -123.45;
            const e = NaN;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('+b ^ NaN', () => {
            const b = 123.45;
            const e = NaN;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('-b ^ -Infinity', () => {
            const b = -123.45;
            const e = -Infinity;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('+b ^ -Infinity', () => {
            const b = 123.45;
            const e = -Infinity;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('-b ^ +Infinity', () => {
            const b = -123.45;
            const e = Infinity;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('+b ^ +Infinity', () => {
            const b = 123.45;
            const e = Infinity;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('-Infinity ^ 0', () => {
            const b = -Infinity;
            const e = 0;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('+Infinity ^ 0', () => {
            const b = Infinity;
            const e = 0;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('-Infinity ^ -e', () => {
            const b = -Infinity;
            const e = -123.45;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('-Infinity ^ +e', () => {
            const b = -Infinity;
            const e = -123.45;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('+Infinity ^ -e', () => {
            const b = Infinity;
            const e = -123.45;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('+Infinity ^ +e', () => {
            const b = Infinity;
            const e = 123.45;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('-Infinity ^ -Infinity', () => {
            const b = -Infinity;
            const e = -Infinity;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('-Infinity ^ +Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('+Infinity ^ -Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('+Infinity ^ +Infinity', () => {
            const b = -Infinity;
            const e = Infinity;
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            const expected = b ** e;
            (0, globals_1.expect)(actual.n).toBe(expected);
        });
        (0, globals_1.test)('b ^ -e', () => {
            const b = 3;
            const e = -2;
            const expected = (0, bignumber_js_1.BigNumber)(b).pow((0, bignumber_js_1.BigNumber)(e));
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('-b ^ +e', () => {
            const b = -2;
            const e = 7;
            const expected = (0, bignumber_js_1.BigNumber)(b).pow((0, bignumber_js_1.BigNumber)(e));
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('+b ^ +e', () => {
            const b = 0.7;
            const e = 8;
            const expected = (0, bignumber_js_1.BigNumber)(b).pow((0, bignumber_js_1.BigNumber)(e));
            const actual = src_1.FixedPointNumber.of(b).pow(src_1.FixedPointNumber.of(e));
            (0, globals_1.expect)(actual.n).toBeCloseTo(expected.toNumber());
        });
        (0, globals_1.test)('-b ^ 0 = 1', () => {
            const b = -123.45;
            const e = 0;
            const expected = src_1.FixedPointNumber.ONE;
            const actual = src_1.FixedPointNumber.of(-b).pow(src_1.FixedPointNumber.of(e));
            (0, globals_1.expect)(actual.isEqual(expected)).toBe(true);
        });
        (0, globals_1.test)('+b ^ 0 = 1', () => {
            const b = 123.45;
            const e = 0;
            const expected = src_1.FixedPointNumber.ONE;
            const actual = src_1.FixedPointNumber.of(-b).pow(src_1.FixedPointNumber.of(e));
            (0, globals_1.expect)(actual.isEqual(expected)).toBe(true);
        });
        // https://en.wikipedia.org/wiki/Compound_interest
        (0, globals_1.test)('compound interest - once per year', () => {
            const P = 10000; // 10,000 $
            const R = 0.15; // 15% interest rate
            const N = 1; // interest accrued times per year
            const T = 1; // 1 year of investment time
            const jsA = interestWithNumberType(P, R, N, T);
            const bnA = interestWithBigNumberType(P, R, N, T);
            const fpA = interestWithFixedPointNumberType(P, R, N, T);
            (0, globals_1.expect)(fpA.n).toBeCloseTo(jsA);
            (0, globals_1.expect)(fpA.n).toBeCloseTo(jsA);
            (0, globals_1.expect)(fpA.n).toBeCloseTo(bnA.toNumber());
        });
        (0, globals_1.test)('compound interest - once per day', () => {
            const P = 10000; // 10,000 $
            const R = 0.15; // 15% interest rate
            const N = 365; // interest accrued times per day
            const T = 1; // 1 year of investment time
            const jsA = interestWithNumberType(P, R, N, T);
            const bnA = interestWithBigNumberType(P, R, N, T);
            const fpA = interestWithFixedPointNumberType(P, R, N, T);
            (0, globals_1.expect)(fpA.n).not.toBe(jsA);
            (0, globals_1.expect)(fpA.n).toBeCloseTo(bnA.toNumber());
        });
    });
    (0, globals_1.describe)('sqrt method tests', () => {
        (0, globals_1.test)('NaN -> NaN', () => {
            const n = NaN;
            const actual = src_1.FixedPointNumber.of(n).sqrt();
            const expected = (0, bignumber_js_1.BigNumber)(n).sqrt();
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinity -> NaN', () => {
            const actual = src_1.FixedPointNumber.NEGATIVE_INFINITY.sqrt();
            const expected = Math.sqrt(-Infinity);
            (0, globals_1.expect)(actual.n).toBe(expected);
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('+Infinity -> +Infinity', () => {
            const n = Infinity;
            const actual = src_1.FixedPointNumber.of(n).sqrt();
            const expected = (0, bignumber_js_1.BigNumber)(n).sqrt();
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(Infinity);
        });
        (0, globals_1.test)('-n -> NaN', () => {
            const n = -123.45;
            const actual = src_1.FixedPointNumber.of(n).sqrt();
            const expected = (0, bignumber_js_1.BigNumber)(n).sqrt();
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('n -> integer', () => {
            const n = 16;
            const actual = src_1.FixedPointNumber.of(n).sqrt();
            const expected = (0, bignumber_js_1.BigNumber)(n).sqrt();
            (0, globals_1.expect)(actual.n).toBe(expected.toNumber());
        });
        (0, globals_1.test)('n -> rational', () => {
            const fd = 13;
            const n = 3;
            const actual = src_1.FixedPointNumber.of(n).sqrt();
            const expected = (0, bignumber_js_1.BigNumber)(n).sqrt();
            (0, globals_1.expect)(actual.n.toFixed(fd)).toBe(expected.toNumber().toFixed(fd));
        });
    });
    (0, globals_1.describe)('times method tests', () => {
        (0, globals_1.test)('NaN * ±n -> NaN', () => {
            const l = NaN;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('±n * NaN -> NaN', () => {
            const l = -123.45;
            const r = NaN;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(NaN);
        });
        (0, globals_1.test)('-Infinity * -Infinity -> +Infinity', () => {
            const l = -Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(Infinity);
        });
        (0, globals_1.test)('-Infinity * +Infinity -> -Infinity', () => {
            const l = -Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(-Infinity);
        });
        (0, globals_1.test)('-Infinity * -n -> +Infinity', () => {
            const l = -Infinity;
            const r = -123.45;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(Infinity);
        });
        (0, globals_1.test)('-Infinity * +n -> -Infinity', () => {
            const l = -Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(-Infinity);
        });
        (0, globals_1.test)('+Infinity * -Infinity -> -Infinity', () => {
            const l = Infinity;
            const r = -Infinity;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(-Infinity);
        });
        (0, globals_1.test)('+Infinity * +Infinity -> +Infinity', () => {
            const l = Infinity;
            const r = Infinity;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(Infinity);
        });
        (0, globals_1.test)('+Infinity * -n -> -Infinity', () => {
            const l = Infinity;
            const r = -123.45;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(-Infinity);
        });
        (0, globals_1.test)('+Infinity * +n -> +Infinity', () => {
            const l = Infinity;
            const r = 123.45;
            const actual = src_1.FixedPointNumber.of(l).times(src_1.FixedPointNumber.of(r));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actual.n).toEqual(expected.toNumber());
            (0, globals_1.expect)(actual.n).toBe(Infinity);
        });
        (0, globals_1.test)('l * r - scale test', () => {
            const l = 0.6;
            const r = 3;
            const actualUp = src_1.FixedPointNumber.of(l, 7n).times(src_1.FixedPointNumber.of(r, 5n));
            const actualDn = src_1.FixedPointNumber.of(l, 5n).times(src_1.FixedPointNumber.of(r, 7n));
            const expected = (0, bignumber_js_1.BigNumber)(l).times((0, bignumber_js_1.BigNumber)(r));
            (0, globals_1.expect)(actualUp.eq(src_1.FixedPointNumber.of(expected.toNumber()))).toBe(true);
            (0, globals_1.expect)(actualUp.eq(actualDn)).toBe(true);
        });
    });
    (0, globals_1.describe)('toString methods tests', () => {
        (0, globals_1.test)('< 1', () => {
            const expected = 0.0001;
            const actual = src_1.FixedPointNumber.of(expected);
            (0, globals_1.expect)(actual.toString()).toEqual(expected.toString());
        });
        (0, globals_1.test)('> 1', () => {
            const expected = 123.456;
            const actual = src_1.FixedPointNumber.of(123.456);
            (0, globals_1.expect)(actual.toString()).toEqual(expected.toString());
        });
        (0, globals_1.test)('NaN', () => {
            const expected = Number.NaN;
            const actual = src_1.FixedPointNumber.of(expected);
            (0, globals_1.expect)(actual.toString()).toEqual(expected.toString());
        });
        (0, globals_1.test)('-Infinity', () => {
            const expected = -Infinity;
            const actual = src_1.FixedPointNumber.of(-Infinity);
            (0, globals_1.expect)(actual.toString()).toEqual(expected.toString());
        });
        (0, globals_1.test)('+Infinity', () => {
            const expected = -Infinity;
            const actual = src_1.FixedPointNumber.of(expected);
            (0, globals_1.expect)(actual.toString()).toEqual(expected.toString());
        });
        (0, globals_1.test)('no fractional digits', () => {
            const expected = 123;
            const actual = src_1.FixedPointNumber.of(expected, 0n);
            (0, globals_1.expect)(actual.toString()).toEqual(expected.toString());
        });
    });
});
function interestWithBigNumberType(P, r, n, t) {
    const _P = (0, bignumber_js_1.BigNumber)(P);
    const _r = (0, bignumber_js_1.BigNumber)(r);
    const _n = (0, bignumber_js_1.BigNumber)(n);
    const _t = (0, bignumber_js_1.BigNumber)(t);
    return (0, bignumber_js_1.BigNumber)(1).plus(_r.div(n)).pow(_t.times(_n)).times(_P);
}
function interestWithFixedPointNumberType(P, r, n, t) {
    const _P = src_1.FixedPointNumber.of(P);
    const _r = src_1.FixedPointNumber.of(r);
    const _n = src_1.FixedPointNumber.of(n);
    const _t = src_1.FixedPointNumber.of(t);
    return src_1.FixedPointNumber.ONE.plus(_r.div(_n)).pow(_t.times(_n)).times(_P);
}
function interestWithNumberType(P, r, n, t) {
    return (1 + r / n) ** (t * n) * P;
}
