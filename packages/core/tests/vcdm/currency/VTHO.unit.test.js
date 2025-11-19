"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const VTHO_1 = require("../../../src/vcdm/currency/VTHO");
/**
 * Test VTHO class.
 * @group unit/vcdm
 */
const VTHOFixture = {
    value: '123456789.012345678'
};
describe('VTHO class tests', () => {
    describe('Construction tests', () => {
        (0, globals_1.expect)(VTHO_1.VTHO.of(src_1.FixedPointNumber.of(VTHOFixture.value))).toBeInstanceOf(VTHO_1.VTHO);
    });
    test('toString method', () => {
        const expected = `${src_1.Txt.of(VTHOFixture.value)} ${VTHO_1.VTHO.CODE}`;
        const actual = VTHO_1.VTHO.of(src_1.FixedPointNumber.of(VTHOFixture.value)).toString();
        (0, globals_1.expect)(actual).toEqual(expected);
    });
});
