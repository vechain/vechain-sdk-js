import { expect } from '@jest/globals';
import { FixedPointNumber, Txt } from '../../../src';
import { FungibleToken } from '../../../src/vcdm/currency/FungibleToken';

/**
 * Test FungibleToken class.
 * @group unit/vcdm
 */

const tokenValue = '123456789.012345678';
const tokenDecimals = 20n; // 18 decimals is tested via VTHO

class TestToken extends FungibleToken {
    constructor(value: FixedPointNumber) {
        super(Txt.of('TEST'), value, tokenDecimals);
    }
}

class DefaultDecimalsToken extends FungibleToken {
    constructor(value: FixedPointNumber) {
        super(Txt.of('DEFAULT'), value);
    }
}

describe('FungibleToken tests', () => {
    test('toString method', () => {
        const token = new TestToken(FixedPointNumber.of(tokenValue));
        const expected = `${Txt.of(tokenValue)} ${token.code}`;
        const actual = token.toString();
        expect(actual).toEqual(expected);
    });

    test('Wei value', () => {
        const expectedWei =
            FixedPointNumber.of(tokenValue).dp(tokenDecimals).scaledValue;
        const token = new TestToken(FixedPointNumber.of(tokenValue));
        const actualWei = token.wei;
        expect(actualWei).toEqual(expectedWei);
    });

    test('Default decimals', () => {
        const expectedWei = FixedPointNumber.of(tokenValue).dp(18n).scaledValue;
        const token = new DefaultDecimalsToken(FixedPointNumber.of(tokenValue));
        const actualWei = token.wei;
        expect(actualWei).toEqual(expectedWei);
    });
});
