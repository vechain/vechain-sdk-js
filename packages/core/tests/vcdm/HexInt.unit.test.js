"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Test HexInt class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('HexInt class tests', () => {
    (0, globals_1.describe)('VeChain Data Model tests', () => {
        (0, globals_1.test)('Return equals values for bi and n properties from bigint value', () => {
            const exp = -789514n; // Safe integer
            const hex = src_1.HexInt.of(exp);
            (0, globals_1.expect)(hex.bi).toEqual(exp);
            (0, globals_1.expect)(hex.n).toEqual(Number(exp));
            (0, globals_1.expect)(hex.toString()).toEqual('-0x0c0c0a');
        });
        (0, globals_1.test)('Return equals values for bi and n properties from number value', () => {
            const exp = 12648430; // Safe integer.
            const hex = src_1.HexInt.of(exp);
            (0, globals_1.expect)(hex.n).toEqual(exp);
            (0, globals_1.expect)(hex.bi).toEqual(BigInt(exp));
            (0, globals_1.expect)(hex.toString()).toEqual('0xc0ffee');
        });
        (0, globals_1.test)('Throw an exception if this integer is beyond safe integer range - underflow', () => {
            const largeBigInt = BigInt(Number.MIN_SAFE_INTEGER) - BigInt(10);
            const hexIntInstance = src_1.HexInt.of(largeBigInt);
            (0, globals_1.expect)(() => hexIntInstance.n).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw an exception if this integer is beyond safe integer range - overflow', () => {
            const largeBigInt = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(10);
            const hexIntInstance = src_1.HexInt.of(largeBigInt);
            (0, globals_1.expect)(() => hexIntInstance.n).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Return an HexInt instance if the passed argument is a bigint', () => {
            const exp = 12357n;
            const hex = src_1.HexInt.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.HexInt);
        });
        (0, globals_1.test)('Return an HexInt instance if the passed argument is an integer number', () => {
            const exp = 12357;
            const hex = src_1.HexInt.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.HexInt);
        });
        (0, globals_1.test)('Return an HexInt instance if the passed argument is an string hexadecimal expression', () => {
            const exp = '-C0c0a'; // Safe integer -789514.
            const hex = src_1.HexInt.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.HexInt);
        });
        (0, globals_1.test)('Return an HexInt instance if the passed argument is an Hex', () => {
            const exp = src_1.Hex.of(-789514n);
            const hex = src_1.HexInt.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.HexInt);
            (0, globals_1.expect)(hex.isEqual(exp)).toBeTruthy();
        });
        (0, globals_1.test)('Return an HexInt instance if the passed argument is Uint8Array', () => {
            const exp = Uint8Array.of(0xc0, 0xff, 0xee); // Safe integer 12648430.
            const hex = src_1.HexInt.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
        });
        (0, globals_1.test)('Throw an exception if the passed argument is not an integer number', () => {
            const exp = 123.57;
            (0, globals_1.expect)(() => src_1.HexInt.of(exp)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('Polymorphism equivalence', () => {
        (0, globals_1.test)('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = src_1.HexInt.of(255n);
            const ofBytes = src_1.HexInt.of(Uint8Array.of(255));
            const ofHex = src_1.HexInt.of('0xff');
            const ofN = src_1.HexInt.of(255);
            (0, globals_1.expect)(ofBi.isEqual(ofBytes)).toBeTruthy();
            (0, globals_1.expect)(ofBytes.isEqual(ofHex)).toBeTruthy();
            (0, globals_1.expect)(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });
});
