"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const BlockRefFixture = {
    invalid: {
        short: '0x0101d054',
        noHex: '0xInvalidThorID'
    },
    valid: {
        bytes: '0x0101d05409d55cce',
        number: '0x00000000000000ff' // This safely casts to number.
    }
};
/**
 * Test BlockRef class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('BlockRef class tests.', () => {
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Return a BlockRef instance if the passed argument is an array of bytes', () => {
            const exp = src_1.HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = src_1.BlockRef.of(exp.bytes);
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.BlockRef);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a BlockRef instance if the passed argument is a bigint', () => {
            const exp = src_1.HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = src_1.BlockRef.of(exp.bi);
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.BlockRef);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a BlockRef instance if the passed argument is a number', () => {
            const exp = src_1.HexUInt.of(BlockRefFixture.valid.number);
            const tid = src_1.BlockRef.of(exp.n); // This is a safe number cast.
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.BlockRef);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a BlockRef instance if the passed argument is a `0x` prefixed string', () => {
            const exp = src_1.HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = src_1.BlockRef.of(exp.toString());
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.BlockRef);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a BlockRef instance if the passed argument is a not prefixed string', () => {
            const exp = src_1.HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = src_1.BlockRef.of(exp.digits);
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.BlockRef);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Return a BlockRef instance if the passed argument is a HexUint instance', () => {
            const exp = src_1.HexUInt.of(BlockRefFixture.valid.bytes);
            const tid = src_1.BlockRef.of(exp);
            (0, globals_1.expect)(tid).toBeInstanceOf(src_1.BlockRef);
            (0, globals_1.expect)(tid.isEqual(exp)).toBe(true);
        });
        (0, globals_1.test)('Throw an error if the passed argument is a negative bigint', () => {
            (0, globals_1.expect)(() => src_1.BlockRef.of(-1)).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw an error if the passed argument is a negative number', () => {
            (0, globals_1.expect)(() => src_1.BlockRef.of(-1n)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('isValid method tests', () => {
        (0, globals_1.test)('Return false for no hex expression', () => {
            (0, globals_1.expect)(src_1.BlockRef.isValid(BlockRefFixture.invalid.noHex)).toBe(false);
        });
        (0, globals_1.test)('Return false for short expression', () => {
            (0, globals_1.expect)(src_1.BlockRef.isValid(BlockRefFixture.invalid.short)).toBe(false);
        });
        (0, globals_1.test)('Return true for valid `0x` prefixed expression', () => {
            (0, globals_1.expect)(src_1.BlockRef.isValid(BlockRefFixture.valid.bytes)).toBe(true);
        });
        (0, globals_1.test)('Return true for valid `not prefixed expression', () => {
            (0, globals_1.expect)(src_1.BlockRef.isValid(src_1.HexUInt.of(BlockRefFixture.valid.bytes).digits)).toBe(true);
        });
    });
    (0, globals_1.describe)('isValid0x method tests', () => {
        (0, globals_1.test)('Return false for no hex expression', () => {
            (0, globals_1.expect)(src_1.BlockRef.isValid0x(BlockRefFixture.invalid.noHex)).toBe(false);
        });
        (0, globals_1.test)('Return false for short expression', () => {
            (0, globals_1.expect)(src_1.BlockRef.isValid0x(BlockRefFixture.invalid.short)).toBe(false);
        });
        (0, globals_1.test)('Return true for valid `0x` prefixed expression', () => {
            (0, globals_1.expect)(src_1.BlockRef.isValid0x(BlockRefFixture.valid.bytes)).toBe(true);
        });
        (0, globals_1.test)('Return false for valid `not prefixed expression', () => {
            (0, globals_1.expect)(src_1.BlockRef.isValid0x(src_1.HexUInt.of(BlockRefFixture.valid.bytes).digits)).toBe(false);
        });
    });
    (0, globals_1.test)('digits property should return 16 characters', () => {
        const tid = src_1.BlockRef.of(0);
        (0, globals_1.expect)(tid.digits.length).toBe(16);
    });
    (0, globals_1.test)('toString method should return 18 characters', () => {
        const tid = src_1.BlockRef.of(0);
        (0, globals_1.expect)(tid.toString().length).toBe(18);
    });
});
