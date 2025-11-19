"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
/**
 * Test Revision class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('Revision class tests', () => {
    (0, globals_1.describe)('isValid method tests', () => {
        (0, globals_1.describe)('isValid for number value', () => {
            (0, globals_1.test)('Return false for negative value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid(-12357)).toBeFalsy();
            });
            (0, globals_1.test)('Return false for not integer value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid(123.57)).toBeFalsy();
            });
            (0, globals_1.test)('Return true for positive value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid(12357)).toBeTruthy();
            });
        });
        (0, globals_1.describe)('isValid for string value', () => {
            (0, globals_1.test)('Return false for negative value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('-12357')).toBeFalsy();
            });
            (0, globals_1.test)('Return false for not integer value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('123.57')).toBeFalsy();
            });
            (0, globals_1.test)('Return false for not numeric not a block tag', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('ABadBabe')).toBeFalsy();
            });
            (0, globals_1.test)('Return false for negative hex value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('0x-ABadBabe')).toBeFalsy();
            });
            (0, globals_1.test)('Return true for positive hex value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('0xABadBabe')).toBeTruthy();
            });
            (0, globals_1.test)('Return true for positive value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('12357')).toBeTruthy();
            });
            (0, globals_1.test)('Return true for `best` value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('best')).toBeTruthy();
            });
            (0, globals_1.test)('Return true for `finalized` value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('finalized')).toBeTruthy();
            });
            (0, globals_1.test)('Return true for `next` value', () => {
                (0, globals_1.expect)(src_1.Revision.isValid('next')).toBeTruthy();
            });
        });
    });
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.describe)('From bigint value', () => {
            (0, globals_1.test)('Return a Revision instance for a valid value', () => {
                const value = 12357n;
                const rev = src_1.Revision.of(value);
                (0, globals_1.expect)(rev).toBeInstanceOf(src_1.Revision);
                (0, globals_1.expect)(rev.bi).toEqual(value);
            });
            (0, globals_1.test)('Throw an exception for an invalid value', () => {
                (0, globals_1.expect)(() => src_1.Revision.of(-12357n)).toThrow(sdk_errors_1.InvalidDataType);
            });
        });
        (0, globals_1.describe)('From number value', () => {
            (0, globals_1.test)('Return a Revision instance for a valid value', () => {
                const value = 12357;
                const rev = src_1.Revision.of(value);
                (0, globals_1.expect)(rev).toBeInstanceOf(src_1.Revision);
                (0, globals_1.expect)(rev.n).toEqual(value);
            });
            (0, globals_1.test)('Throw an exception for an invalid value', () => {
                (0, globals_1.expect)(() => src_1.Revision.of(-12357)).toThrow(sdk_errors_1.InvalidDataType);
            });
        });
        (0, globals_1.describe)('From string value', () => {
            (0, globals_1.test)('Return a Revision instance for a valid `best`', () => {
                const value = 'best';
                const rev = src_1.Revision.of(value);
                (0, globals_1.expect)(rev).toBeInstanceOf(src_1.Revision);
                (0, globals_1.expect)(rev.toString()).toEqual(value);
                (0, globals_1.expect)(rev).toEqual(src_1.Revision.BEST);
            });
            (0, globals_1.test)('Return a Revision instance for a valid `finalized`', () => {
                const value = 'finalized';
                const rev = src_1.Revision.of(value);
                (0, globals_1.expect)(rev).toBeInstanceOf(src_1.Revision);
                (0, globals_1.expect)(rev.toString()).toEqual(value);
                (0, globals_1.expect)(rev).toEqual(src_1.Revision.FINALIZED);
            });
            (0, globals_1.test)('Return a Revision instance for a valid decimal value', () => {
                const value = 12357;
                const rev = src_1.Revision.of(value.toString());
                (0, globals_1.expect)(rev).toBeInstanceOf(src_1.Revision);
                (0, globals_1.expect)(rev.n).toEqual(value);
            });
            (0, globals_1.test)('Return a Revision instance for a valid hex value', () => {
                const value = '0xff';
                const rev = src_1.Revision.of(value);
                (0, globals_1.expect)(rev).toBeInstanceOf(src_1.Revision);
                (0, globals_1.expect)(rev.n).toEqual(255);
            });
            (0, globals_1.test)('Throw an exception for an invalid value', () => {
                (0, globals_1.expect)(() => src_1.Revision.of(`worst`)).toThrow(sdk_errors_1.InvalidDataType);
            });
        });
        (0, globals_1.describe)('From Hex value', () => {
            (0, globals_1.test)('Return a Revision instance for a valid value', () => {
                const rev = src_1.Revision.of(src_1.Hex.of('0x0FF1CE'));
                (0, globals_1.expect)(rev).toBeInstanceOf(src_1.Revision);
            });
            (0, globals_1.test)('Throw an exception for an invalid value', () => {
                (0, globals_1.expect)(() => src_1.Revision.of(src_1.Hex.of('-0x0FF1CE'))).toThrow(sdk_errors_1.InvalidDataType);
            });
        });
        (0, globals_1.describe)('From Uint8Array value', () => {
            (0, globals_1.test)('Return a Revision instance for a valid value', () => {
                const rev = src_1.Revision.of(src_1.Txt.of('best').bytes);
                (0, globals_1.expect)(rev).toBeInstanceOf(src_1.Revision);
            });
            (0, globals_1.test)('Throw an exception for an invalid value', () => {
                (0, globals_1.expect)(() => src_1.Revision.of(src_1.Txt.of('worst').bytes)).toThrow(sdk_errors_1.InvalidDataType);
            });
        });
    });
});
