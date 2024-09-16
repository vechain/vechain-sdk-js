import { expect } from '@jest/globals';
import { FPN, Txt } from '../../../src';
import { VTHO } from '../../../src/vcdm/currency/VTHO';

/**
 * Test VTHO class.
 * @group unit/vcdm
 */
const VTHOFixture = {
    value: '123456789.012345678'
};

describe('VTHO class tests', () => {
    describe('Construction tests', () => {
        expect(VTHO.of(FPN.of(VTHOFixture.value))).toBeInstanceOf(VTHO);
    });

    test('toString method', () => {
        const expected = `${Txt.of(VTHOFixture.value)} ${VTHO.CODE}`;
        const actual = VTHO.of(FPN.of(VTHOFixture.value)).toString();
        expect(actual).toEqual(expected);
    });
});
