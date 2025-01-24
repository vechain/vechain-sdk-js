import { expect } from '@jest/globals';
import { FixedPointNumber, Txt } from '../../../src';
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
        expect(VTHO.of(FixedPointNumber.of(VTHOFixture.value))).toBeInstanceOf(
            VTHO
        );
    });

    test('toString method', () => {
        const expected = `${Txt.of(VTHOFixture.value)} ${VTHO.CODE}`;
        const actual = VTHO.of(
            FixedPointNumber.of(VTHOFixture.value)
        ).toString();
        expect(actual).toEqual(expected);
    });

    test('Wei value', () => {
        const expected = FixedPointNumber.of(VTHOFixture.value).dp(
            18n
        ).scaledValue;
        const actual = VTHO.of(FixedPointNumber.of(VTHOFixture.value)).wei;
        expect(actual).toEqual(expected);
    });
});
