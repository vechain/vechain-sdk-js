import { expect } from '@jest/globals';
import { FixedPointNumber, Txt, VET } from '../../../src';

const VETFixture = {
    value: FixedPointNumber.of('123456789.012345678')
};

/**
 * Test VET class.
 * @group unit/vcdm
 */
describe('VET class tests', () => {
    describe('Construction tests', () => {
        expect(VET.of(VETFixture.value)).toBeInstanceOf(VET);
    });

    test('toString method', () => {
        const expected = `${Txt.of(VETFixture.value.toString())} ${VET.CODE}`;
        const actual = VET.of(VETFixture.value).toString();
        expect(actual).toEqual(expected);
    });
});
