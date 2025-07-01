import { describe, expect, test } from '@jest/globals';
import { FixedPointNumber, Txt, VTHO } from '@vcdm';

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
});
