import { FPN, Txt } from '../../../src';
import { VET } from '../../../src/vcdm/currency/VET';
import { expect } from '@jest/globals';

const VETFixture = {
    value: FPN.of('123456789.012345678')
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
