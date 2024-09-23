import { expect } from '@jest/globals';
import { formatEther, formatUnits, parseEther, parseUnits } from 'viem';
import { FPN, Units } from '../../../src';

const UnitsFixture = {
    oneWei: 1n,
    oneGwei: 1000000000n,
    oneEther: 1000000000000000000n
};

/**
 * Test Units class.
 * @group unit/vcdm
 */
describe('Units namespace tests', () => {
    describe('formatEther method tests', () => {
        test('integer result should append .0', () => {
            const exp = UnitsFixture.oneEther;
            const expected = formatEther(exp);
            const actual = Units.formatEther(FPN.of(exp));
            expect(actual).toEqual(expected);
        });

        test('not integer result', () => {
            const exp = 1234567890n;
            const expected = formatEther(exp);
            const actual = Units.formatEther(FPN.of(exp));
            expect(actual).toEqual(expected);
        });
    });

    describe('formatUnits method tests', () => {
        test('ether', () => {
            const exp = UnitsFixture.oneEther;
            const expected = Number(formatUnits(exp, Units.ether)).toFixed(1);
            const actual = Units.formatUnits(FPN.of(exp));
            expect(actual).toEqual(expected);
        });

        test('gwei', () => {
            const exp = UnitsFixture.oneGwei;
            const expected = Number(formatUnits(exp, Units.gwei)).toFixed(1);
            const actual = Units.formatUnits(FPN.of(exp), Units.gwei);
            expect(actual).toEqual(expected);
        });

        test('wei', () => {
            const exp = UnitsFixture.oneWei;
            const expected = formatUnits(exp, Units.wei);
            const actual = Units.formatUnits(FPN.of(exp), Units.wei);
            expect(Number(actual)).toEqual(Number(expected));
        });
    });

    describe('parseEther method tests', () => {
        test('positive integer (natural)', () => {
            const exp = '1';
            const expected = parseEther(exp);
            const actual = Units.parseEther(exp);
            expect(actual.bi).toEqual(expected);
        });

        test('negative rational', () => {
            const exp = '-1234.56789';
            const expected = parseEther(exp);
            const actual = Units.parseEther(exp);
            expect(actual.bi).toEqual(expected);
        });
    });

    describe('parseUnits method tests', () => {
        test('ether', () => {
            const exp = '1.0';
            const expected = parseUnits(exp, Units.ether);
            const actual = Units.parseUnits(exp);
            expect(actual.bi).toEqual(expected);
        });

        test('gwei', () => {
            const exp = '123.45';
            const expected = parseUnits(exp, Units.gwei);
            const actual = Units.parseUnits(exp, Units.gwei);
            expect(actual.bi).toEqual(expected);
        });

        test('wei', () => {
            const exp = '1';
            const expected = parseUnits(exp, Units.wei);
            const actual = Units.parseUnits(exp, Units.wei);
            expect(actual.bi).toEqual(expected);
        });
    });
});
