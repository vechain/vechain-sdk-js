"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
const VET_1 = require("../../../src/vcdm/currency/VET");
const globals_1 = require("@jest/globals");
const VETFixture = {
    value: src_1.FixedPointNumber.of('123456789.012345678')
};
/**
 * Test VET class.
 * @group unit/vcdm
 */
describe('VET class tests', () => {
    describe('Construction tests', () => {
        (0, globals_1.expect)(VET_1.VET.of(VETFixture.value)).toBeInstanceOf(VET_1.VET);
    });
    test('toString method', () => {
        const expected = `${src_1.Txt.of(VETFixture.value.toString())} ${VET_1.VET.CODE}`;
        const actual = VET_1.VET.of(VETFixture.value).toString();
        (0, globals_1.expect)(actual).toEqual(expected);
    });
});
