"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
/**
 * Test Quantity class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('Quantity class tests', () => {
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Return a Quantity instance if the passed argument is zero bigint', () => {
            const q = src_1.Quantity.of(0n);
            (0, globals_1.expect)(q).toBeInstanceOf(src_1.Quantity);
            (0, globals_1.expect)(q.toString()).toEqual('0x0');
        });
        (0, globals_1.test)('Return a Quantity instance if the passed argument is zero number', () => {
            const q = src_1.Quantity.of(0);
            (0, globals_1.expect)(q).toBeInstanceOf(src_1.Quantity);
            (0, globals_1.expect)(q.toString()).toEqual('0x0');
        });
        (0, globals_1.test)('Return a Quantity instance if the passed argument is non-zero bigint', () => {
            const q = src_1.Quantity.of(src_1.Hex.of('0xc0c0a').bi);
            (0, globals_1.expect)(q).toBeInstanceOf(src_1.Quantity);
            (0, globals_1.expect)(q.toString()).toEqual('0xc0c0a');
        });
        (0, globals_1.test)('Return a Quantity instance if the passed argument is non-zero number', () => {
            const q = src_1.Quantity.of(12648430);
            (0, globals_1.expect)(q).toBeInstanceOf(src_1.Quantity);
            (0, globals_1.expect)(q.toString()).toEqual('0xc0ffee');
        });
        (0, globals_1.test)('Throw an error if the passed argument is negative bigint', () => {
            (0, globals_1.expect)(() => src_1.Quantity.of(-12357n)).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw an error if the passed argument is negative number', () => {
            (0, globals_1.expect)(() => src_1.Quantity.of(-12357)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
});
