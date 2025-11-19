"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const ThorIdFixture = {
    invalid: {
        short: '0x271f7db20141001975f71deb8fca90d6b22b8d6610d',
        noHex: '0xInvalidThorID'
    },
    valid: {
        bytes: '0x271f7db20141001975f71deb8fca90d6b22b8d6610dfb5a3e0bbeaf78b5a4891',
        number: '0x00000000000000000000000000000000000000000000000000000000000000ff' // This safely casts to number.
    }
};
/**
 * Test ThorId class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('ThorId class tests.', () => {
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Return a ThorId instance if the passed argument is an array of bytes', () => {
            const exp = src_1.HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = src_1.ThorId.of(exp.bytes);
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.ThorId);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a ThorId instance if the passed argument is a bigint', () => {
            const exp = src_1.HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = src_1.ThorId.of(exp.bi);
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.ThorId);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a ThorId instance if the passed argument is a number', () => {
            const exp = src_1.HexUInt.of(ThorIdFixture.valid.number);
            const tid = src_1.ThorId.of(exp.n); // This is a safe number cast.
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.ThorId);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a ThorId instance if the passed argument is a `0x` prefixed string', () => {
            const exp = src_1.HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = src_1.ThorId.of(exp.toString());
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.ThorId);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a ThorId instance if the passed argument is a not prefixed string', () => {
            const exp = src_1.HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = src_1.ThorId.of(exp.digits);
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.ThorId);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a ThorId instance if the passed argument is a HexUint instance', () => {
            const exp = src_1.HexUInt.of(ThorIdFixture.valid.bytes);
            const tid = src_1.ThorId.of(exp);
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.ThorId);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Throw an error if the passed argument is a negative bigint', () => {
            (0, globals_1.expect)(() => src_1.ThorId.of(-1)).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw an error if the passed argument is a negative number', () => {
            (0, globals_1.expect)(() => src_1.ThorId.of(-1n)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('isValid method tests', () => {
        (0, globals_1.test)('Return false for no hex expression', () => {
            (0, globals_1.expect)(src_1.ThorId.isValid(ThorIdFixture.invalid.noHex)).toBe(false);
        });
        (0, globals_1.test)('Return false for short expression', () => {
            (0, globals_1.expect)(src_1.ThorId.isValid(ThorIdFixture.invalid.short)).toBe(false);
        });
        (0, globals_1.test)('Return true for valid `0x` prefixed expression', () => {
            (0, globals_1.expect)(src_1.ThorId.isValid(ThorIdFixture.valid.bytes)).toBe(true);
        });
        (0, globals_1.test)('Return true for valid `not prefixed expression', () => {
            (0, globals_1.expect)(src_1.ThorId.isValid(src_1.HexUInt.of(ThorIdFixture.valid.bytes).digits)).toBe(true);
        });
    });
    (0, globals_1.describe)('isValid0x method tests', () => {
        (0, globals_1.test)('Return false for no hex expression', () => {
            (0, globals_1.expect)(src_1.ThorId.isValid0x(ThorIdFixture.invalid.noHex)).toBe(false);
        });
        (0, globals_1.test)('Return false for short expression', () => {
            (0, globals_1.expect)(src_1.ThorId.isValid0x(ThorIdFixture.invalid.short)).toBe(false);
        });
        (0, globals_1.test)('Return true for valid `0x` prefixed expression', () => {
            (0, globals_1.expect)(src_1.ThorId.isValid0x(ThorIdFixture.valid.bytes)).toBe(true);
        });
        (0, globals_1.test)('Return false for valid `not prefixed expression', () => {
            (0, globals_1.expect)(src_1.ThorId.isValid0x(src_1.HexUInt.of(ThorIdFixture.valid.bytes).digits)).toBe(false);
        });
    });
    (0, globals_1.test)('digits property should return 64 characters', () => {
        const tid = src_1.ThorId.of(0);
        (0, globals_1.expect)(tid.digits.length).toBe(64);
    });
    (0, globals_1.test)('toString method should return 66 characters', () => {
        const tid = src_1.ThorId.of(0);
        (0, globals_1.expect)(tid.toString().length).toBe(66);
    });
});
