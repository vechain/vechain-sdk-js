"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Test HexUInt class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('HexUInt class tests', () => {
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Return an HexUInt instance if the passed argument is positive', () => {
            const exp = '0xcaffee';
            const hi = src_1.HexUInt.of(exp);
            (0, globals_1.expect)(hi).toBeInstanceOf(src_1.HexUInt);
        });
        (0, globals_1.test)('Throw an error if the passed argument is negative', () => {
            const exp = '-0xcaffee';
            (0, globals_1.expect)(() => src_1.HexUInt.of(exp)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('Polymorphism equivalence', () => {
        (0, globals_1.test)('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = src_1.HexUInt.of(255n);
            const ofBytes = src_1.HexUInt.of(Uint8Array.of(255));
            const ofHex = src_1.HexUInt.of('0xff');
            const ofN = src_1.HexUInt.of(255);
            (0, globals_1.expect)(ofBi.isEqual(ofBytes)).toBeTruthy();
            (0, globals_1.expect)(ofBytes.isEqual(ofHex)).toBeTruthy();
            (0, globals_1.expect)(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });
});
