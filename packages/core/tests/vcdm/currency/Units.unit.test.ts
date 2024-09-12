import { FPN, Units } from '../../../src';
import { ethers } from 'ethers';
import { expect } from '@jest/globals';

const UnitsFixture = {
    oneWei: '1',
    oneGwei: '1000000000',
    oneEther: '1000000000000000000'
};

/**
 * Test Account class.
 * @group unit/vcdm
 */
describe('Units namespace tests', () => {
    describe('formatEther method tests', () => {
        test('integer result should append .0', () => {
            const exp = UnitsFixture.oneEther;
            const expected = ethers.formatEther(exp);
            const actual = Units.formatEther(FPN.of(exp));
            expect(actual).toEqual(expected);
        });

        test('not integer result', () => {
            const exp = '1234567890';
            const expected = ethers.formatEther(exp);
            const actual = Units.formatEther(FPN.of(exp));
            expect(actual).toEqual(expected);
        });
    });

    describe('formatUnits method tests', () => {
        test('ether', () => {
            const exp = UnitsFixture.oneEther;
            const expected = ethers.formatUnits(exp);
            const actual = Units.formatUnits(FPN.of(exp));
            expect(actual).toEqual(expected);
        });

        test('gwei', () => {
            const exp = '1000000000';
            const expected = ethers.formatUnits(exp, Units.gwei);
            const actual = Units.formatUnits(FPN.of(exp), Units.gwei);
            expect(actual).toEqual(expected);
        });

        test('wei', () => {
            const exp = UnitsFixture.oneGwei;
            const expected = ethers.formatUnits(exp, Units.wei);
            const actual = Units.formatUnits(FPN.of(exp), Units.wei);
            expect(actual).toEqual(expected);
        });
    });

    describe('parseEther method tests', () => {
        test('positive integer (natural)', () => {
            const exp = '1';
            const expected = ethers.parseEther(exp);
            const actual = Units.parseEther(exp);
            expect(actual.bi).toEqual(expected);
        });

        test('negative rational', () => {
            const exp = '-1234.56789';
            const expected = ethers.parseEther(exp);
            const actual = Units.parseEther(exp);
            expect(actual.bi).toEqual(expected);
        });
    });

    describe('parseUnits method tests', () => {
        test('ether', () => {
            const exp = '1.0';
            const expected = ethers.parseUnits(exp);
            const actual = Units.parseUnits(exp);
            expect(actual.bi).toEqual(expected);
        });

        test('gwei', () => {
            const exp = '123.45';
            const expected = ethers.parseUnits(exp, Units.gwei);
            const actual = Units.parseUnits(exp, Units.gwei);
            expect(actual.bi).toEqual(expected);
        });

        test('wei', () => {
            const exp = '1';
            const expected = ethers.parseUnits(exp, Units.wei);
            const actual = Units.parseUnits(exp, Units.wei);
            expect(actual.bi).toEqual(expected);
        });
    });
});
