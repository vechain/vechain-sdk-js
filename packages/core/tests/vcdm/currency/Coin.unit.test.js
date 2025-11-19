"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const CoinFixure = {
    value: src_1.FixedPointNumber.of('1234567.89')
};
/**
 * Test Coin class.
 * @group unit/vcdm
 */
describe('Coin class tests', () => {
    describe('VeChain Data Model tests', () => {
        test('get bi', () => {
            const expected = CoinFixure.value.bi;
            const actual = src_1.VET.of(CoinFixure.value).bi;
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        test('get bytes', () => {
            const vet = src_1.VET.of(CoinFixure.value);
            const expected = src_1.Txt.of(vet.toString()).bytes;
            const actual = vet.bytes;
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        test('get n', () => {
            const expected = CoinFixure.value.n;
            const actual = src_1.VET.of(CoinFixure.value).n;
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        describe('compareTo tests', () => {
            test('Return a valid number comparing between same currency codes', () => {
                const more = src_1.VET.of(CoinFixure.value);
                const less = src_1.VET.of(CoinFixure.value.div(src_1.FixedPointNumber.of(2)));
                (0, globals_1.expect)(more.compareTo(less)).toBeGreaterThan(0);
                (0, globals_1.expect)(less.compareTo(more)).toBeLessThan(0);
                (0, globals_1.expect)(more.compareTo(more)).toBe(0);
            });
            test('Throw an exception comparing between different currency codes', () => {
                const vet = src_1.VET.of(CoinFixure.value);
                const vtho = src_1.VTHO.of(vet.value);
                (0, globals_1.expect)(() => {
                    vet.compareTo(vtho);
                }).toThrow(sdk_errors_1.InvalidDataType);
            });
        });
        describe('isEqualTo method tests', () => {
            test('Return boolean comparing between same currency codes', () => {
                const more = src_1.VET.of(CoinFixure.value);
                const less = src_1.VET.of(CoinFixure.value.div(src_1.FixedPointNumber.of(2)));
                (0, globals_1.expect)(more.isEqual(less)).toBe(false);
                (0, globals_1.expect)(less.isEqual(less)).toBe(true);
            });
            test('return false comparing different currency code', () => {
                const vet = src_1.VET.of(CoinFixure.value);
                const vtho = src_1.VTHO.of(vet.value);
                (0, globals_1.expect)(vet.isEqual(vtho)).toBe(false);
                (0, globals_1.expect)(vet.isEqual(vet)).toBe(true);
            });
        });
        describe('isEqual method tests', () => {
            test('Return false because code', () => {
                const a = src_1.VET.of(CoinFixure.value);
                const b = src_1.VTHO.of(CoinFixure.value);
                (0, globals_1.expect)(a.isEqual(b)).toBe(false);
            });
            test('Return false because value', () => {
                const a = src_1.VET.of(CoinFixure.value);
                const b = src_1.VET.of(CoinFixure.value.negated());
                (0, globals_1.expect)(b.isEqual(a)).toBe(false);
            });
            test('Return true', () => {
                const a = src_1.VET.of(CoinFixure.value);
                const b = src_1.VET.of(CoinFixure.value);
                (0, globals_1.expect)(b.isEqual(a)).toBe(true);
            });
        });
    });
    describe('Currency tests', () => {
        test('get code', () => {
            const actual = src_1.VET.of(CoinFixure.value);
            (0, globals_1.expect)(actual.code).toEqual(src_1.VET.CODE);
        });
        test('get value', () => {
            const actual = src_1.VTHO.of(CoinFixure.value);
            (0, globals_1.expect)(actual.value).toEqual(CoinFixure.value);
        });
    });
});
