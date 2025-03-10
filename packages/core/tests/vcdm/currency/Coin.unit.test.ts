import { describe, expect, test } from '@jest/globals';
import { type Coin, FixedPointNumber, Txt, VET, VTHO } from '../../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

const CoinFixure = {
    value: FixedPointNumber.of('1234567.89')
};

/**
 * Test Coin class.
 * @group unit/vcdm
 */
describe('Coin class tests', () => {
    describe('VeChain Data Model tests', () => {
        test('get bi', () => {
            const expected = CoinFixure.value.bi;
            const actual = VET.of(CoinFixure.value).bi;
            expect(actual).toEqual(expected);
        });

        test('get bytes', () => {
            const vet: Coin = VET.of(CoinFixure.value) as Coin;
            const expected = Txt.of(vet.toString()).bytes;
            const actual = vet.bytes;
            expect(actual).toEqual(expected);
        });

        test('get n', () => {
            const expected = CoinFixure.value.n;
            const actual = VET.of(CoinFixure.value).n;
            expect(actual).toEqual(expected);
        });

        describe('compareTo tests', () => {
            test('Return a valid number comparing between same currency codes', () => {
                const more = VET.of(CoinFixure.value);
                const less = VET.of(
                    CoinFixure.value.div(FixedPointNumber.of(2))
                );
                expect(more.compareTo(less)).toBeGreaterThan(0);
                expect(less.compareTo(more)).toBeLessThan(0);
                expect(more.compareTo(more)).toBe(0);
            });

            test('Throw an exception comparing between different currency codes', () => {
                const vet = VET.of(CoinFixure.value);
                const vtho = VTHO.of(vet.value);
                expect(() => {
                    vet.compareTo(vtho);
                }).toThrow(InvalidDataType);
            });
        });

        describe('isEqualTo method tests', () => {
            test('Return boolean comparing between same currency codes', () => {
                const more = VET.of(CoinFixure.value);
                const less = VET.of(
                    CoinFixure.value.div(FixedPointNumber.of(2))
                );
                expect(more.isEqual(less)).toBe(false);
                expect(less.isEqual(less)).toBe(true);
            });

            test('return false comparing different currency code', () => {
                const vet = VET.of(CoinFixure.value);
                const vtho = VTHO.of(vet.value);
                expect(vet.isEqual(vtho)).toBe(false);
                expect(vet.isEqual(vet)).toBe(true);
            });
        });

        describe('isEqual method tests', () => {
            test('Return false because code', () => {
                const a: Coin = VET.of(CoinFixure.value) as Coin;
                const b: Coin = VTHO.of(CoinFixure.value) as Coin;
                expect(a.isEqual(b)).toBe(false);
            });

            test('Return false because value', () => {
                const a: Coin = VET.of(CoinFixure.value) as Coin;
                const b: Coin = VET.of(CoinFixure.value.negated()) as Coin;
                expect(b.isEqual(a)).toBe(false);
            });

            test('Return true', () => {
                const a: Coin = VET.of(CoinFixure.value) as Coin;
                const b: Coin = VET.of(CoinFixure.value) as Coin;
                expect(b.isEqual(a)).toBe(true);
            });
        });
    });

    describe('Currency tests', () => {
        test('get code', () => {
            const actual = VET.of(CoinFixure.value);
            expect(actual.code).toEqual(VET.CODE);
        });

        test('get value', () => {
            const actual = VTHO.of(CoinFixure.value);
            expect(actual.value).toEqual(CoinFixure.value);
        });
    });
});
