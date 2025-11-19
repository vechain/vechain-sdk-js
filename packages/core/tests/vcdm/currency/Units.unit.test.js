"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const viem_1 = require("viem");
const src_1 = require("../../../src");
const UnitsFixture = {
    oneWei: 1n,
    oneGwei: 1000000000n,
    oneEther: 1000000000000000000n
};
/**
 * Test Units namespace.
 * @group unit/vcdm
 */
describe('Units namespace tests', () => {
    describe('formatEther method tests', () => {
        test('integer result should append .0', () => {
            const exp = UnitsFixture.oneEther;
            const expected = Number((0, viem_1.formatEther)(exp)).toFixed(1);
            const actual = src_1.Units.formatEther(src_1.FixedPointNumber.of(exp));
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        test('not integer result', () => {
            const exp = 1234567890n;
            const expected = (0, viem_1.formatEther)(exp);
            const actual = src_1.Units.formatEther(src_1.FixedPointNumber.of(exp));
            (0, globals_1.expect)(actual).toEqual(expected);
        });
    });
    describe('formatUnits method tests', () => {
        test('ether', () => {
            const exp = UnitsFixture.oneEther;
            const expected = Number((0, viem_1.formatUnits)(exp, src_1.Units.ether)).toFixed(1);
            const actual = src_1.Units.formatUnits(src_1.FixedPointNumber.of(exp));
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        test('gwei', () => {
            const exp = UnitsFixture.oneGwei;
            const expected = Number((0, viem_1.formatUnits)(exp, src_1.Units.gwei)).toFixed(1);
            const actual = src_1.Units.formatUnits(src_1.FixedPointNumber.of(exp), src_1.Units.gwei);
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        test('wei', () => {
            const exp = UnitsFixture.oneWei;
            const expected = (0, viem_1.formatUnits)(exp, src_1.Units.wei);
            const actual = src_1.Units.formatUnits(src_1.FixedPointNumber.of(exp), src_1.Units.wei);
            (0, globals_1.expect)(Number(actual)).toEqual(Number(expected));
        });
    });
    describe('parseEther method tests', () => {
        test('positive integer (natural)', () => {
            const exp = '1';
            const expected = (0, viem_1.parseEther)(exp);
            const actual = src_1.Units.parseEther(exp);
            (0, globals_1.expect)(actual.bi).toEqual(expected);
        });
        test('negative rational', () => {
            const exp = '-1234.56789';
            const expected = (0, viem_1.parseEther)(exp);
            const actual = src_1.Units.parseEther(exp);
            (0, globals_1.expect)(actual.bi).toEqual(expected);
        });
    });
    describe('parseUnits method tests', () => {
        test('ether', () => {
            const exp = '1.0';
            const expected = (0, viem_1.parseUnits)(exp, src_1.Units.ether);
            const actual = src_1.Units.parseUnits(exp);
            (0, globals_1.expect)(actual.bi).toEqual(expected);
        });
        test('gwei', () => {
            const exp = '123.45';
            const expected = (0, viem_1.parseUnits)(exp, src_1.Units.gwei);
            const actual = src_1.Units.parseUnits(exp, src_1.Units.gwei);
            (0, globals_1.expect)(actual.bi).toEqual(expected);
        });
        test('wei', () => {
            const exp = '1';
            const expected = (0, viem_1.parseUnits)(exp, src_1.Units.wei);
            const actual = src_1.Units.parseUnits(exp, src_1.Units.wei);
            (0, globals_1.expect)(actual.bi).toEqual(expected);
        });
    });
    describe('convertUnits method tests', () => {
        test('wei to 1 gwei', () => {
            const value = src_1.FixedPointNumber.of(1000000000n);
            const expected = src_1.FixedPointNumber.of(1n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.wei, src_1.Units.gwei);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('gwei to 1 wei', () => {
            const value = src_1.FixedPointNumber.of(1n);
            const expected = src_1.FixedPointNumber.of(1000000000n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.gwei, src_1.Units.wei);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('wei to 1 ether', () => {
            const value = src_1.FixedPointNumber.of(1000000000000000000n);
            const expected = src_1.FixedPointNumber.of(1n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.wei, src_1.Units.ether);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('1 ether to wei', () => {
            const value = src_1.FixedPointNumber.of(1n);
            const expected = src_1.FixedPointNumber.of(1000000000000000000n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.ether, src_1.Units.wei);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('1 ether to gwei', () => {
            const value = src_1.FixedPointNumber.of(1n);
            const expected = src_1.FixedPointNumber.of(1000000000n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.ether, src_1.Units.gwei);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('1000 gwei to ether', () => {
            const value = src_1.FixedPointNumber.of(1000n);
            const expected = src_1.FixedPointNumber.of('0.000001');
            const actual = src_1.Units.convertUnits(value, src_1.Units.gwei, src_1.Units.ether);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('1000 gwei to wei', () => {
            const value = src_1.FixedPointNumber.of(1000n);
            const expected = src_1.FixedPointNumber.of(1000000000000n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.gwei, src_1.Units.wei);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('1000000000 wei to ether', () => {
            const value = src_1.FixedPointNumber.of(1000000000n);
            const expected = src_1.FixedPointNumber.of('0.000000001');
            const actual = src_1.Units.convertUnits(value, src_1.Units.wei, src_1.Units.ether);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('1000000000 wei to gwei', () => {
            const value = src_1.FixedPointNumber.of(1000000000n);
            const expected = src_1.FixedPointNumber.of(1n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.wei, src_1.Units.gwei);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('1 wei to ether', () => {
            const value = src_1.FixedPointNumber.of(1n);
            const expected = src_1.FixedPointNumber.of('0.000000000000000001');
            const actual = src_1.Units.convertUnits(value, src_1.Units.wei, src_1.Units.ether);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('wei to wei', () => {
            const value = src_1.FixedPointNumber.of(1000000000n);
            const expected = src_1.FixedPointNumber.of(1000000000n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.wei, src_1.Units.wei);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
        test('100 mwei to wei', () => {
            const value = src_1.FixedPointNumber.of(100n);
            const expected = src_1.FixedPointNumber.of(100000000n);
            const actual = src_1.Units.convertUnits(value, src_1.Units.mwei, src_1.Units.wei);
            (0, globals_1.expect)(actual.eq(expected)).toBe(true);
        });
    });
    describe('formatFromUnits method tests', () => {
        test('wei to gwei', () => {
            const value = src_1.FixedPointNumber.of(1000000000n);
            const expected = '1';
            const actual = src_1.Units.formatFromUnits(value, src_1.Units.wei, src_1.Units.gwei);
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        test('wei to ether', () => {
            const value = src_1.FixedPointNumber.of(1000000000n);
            const expected = '0.000000001';
            const actual = src_1.Units.formatFromUnits(value, src_1.Units.wei, src_1.Units.ether);
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        test('wei to ether with displayDecimals', () => {
            const value = src_1.FixedPointNumber.of(1000000000n);
            const expected = '0.00';
            const actual = src_1.Units.formatFromUnits(value, src_1.Units.wei, src_1.Units.ether, 2);
            (0, globals_1.expect)(actual).toEqual(expected);
        });
    });
});
