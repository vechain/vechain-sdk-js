import { ethers } from 'ethers';
import { describe, expect, test } from '@jest/globals';
import { unitsUtils, type WEI_UNITS } from '../../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * @group unit/utils-units
 */
describe('unitsUtils', () => {
    describe('formatUnits', () => {
        test('invalid - not a number - decimal', () => {
            const value = 'c0ffee';
            expect(() => unitsUtils.formatUnits(value)).toThrowError(
                InvalidDataType
            );
        });

        test('invalid - not a number - hex', () => {
            const value = '0xcOffee';
            expect(() => unitsUtils.formatUnits(value)).toThrowError(
                InvalidDataType
            );
        });

        test('invalid - not a wei unit', () => {
            const value = 1;
            const unit = 'bitcoin' as WEI_UNITS;
            expect(() => unitsUtils.formatUnits(value, unit)).toThrowError(
                InvalidDataType
            );
        });

        test('invalid - negative decimals', () => {
            const value = 1;
            const decimals = -1;
            expect(() => unitsUtils.formatUnits(value, decimals)).toThrowError(
                InvalidDataType
            );
        });

        test('valid - bigint 10^42 - default 10^18', () => {
            const value = 1000000000000000000000000000000000000000000n;
            const expected = '1000000000000000000000000.0';
            expect(unitsUtils.formatUnits(value)).toEqual(expected);
        });

        test('valid - bigint 10^18- number 10^24', () => {
            const value = 1000000000000000000n;
            const decimals = 24;
            const expected = '0.000001';
            expect(unitsUtils.formatUnits(value, decimals)).toEqual(expected);
        });

        test('valid - bigint 10^18 - number 10^80', () => {
            const value = 1000000000000000000n;
            const decimals = 80;
            const expected =
                '0.00000000000000000000000000000000000000000000000000000000000001';
            expect(unitsUtils.formatUnits(value, decimals)).toEqual(expected);
        });

        test('valid - number 10^18 - default 10^18', () => {
            const value = 1000000000000000000;
            const expected = '1.0';
            expect(unitsUtils.formatUnits(value)).toEqual(expected);
        });

        test('valid - number 10^18 - number 10^4', () => {
            const value = 1000000000000000000;
            const decimals = 4;
            const expected = '100000000000000.0';
            expect(unitsUtils.formatUnits(value, decimals)).toEqual(expected);
        });

        test('valid - number 10^5 - default 10^18', () => {
            const value = 100000; // 10^5
            const expected = '0.0000000000001'; // 10^-13
            expect(unitsUtils.formatUnits(value)).toEqual(expected);
        });

        test('valid - number 10^18 - unit ether', () => {
            const value = 1000000000000000000;
            const unit = 'ether';
            const expected = '1.0';
            expect(unitsUtils.formatUnits(value, unit)).toEqual(expected);
        });

        test('valid - number 10^15- unit finney', () => {
            const value = 1000000000000000;
            const unit = 'finney';
            const expected = '1.0';
            expect(unitsUtils.formatUnits(value, unit)).toEqual(expected);
        });

        test('valid - number 10^12 - unit szabo', () => {
            const value = 1000000000000;
            const unit = 'szabo';
            const expected = '1.0';
            expect(unitsUtils.formatUnits(value, unit)).toEqual(expected);
        });

        test('valid - number 10^9 - unit gwei', () => {
            const value = 1000000000;
            const unit = 'gwei';
            const expected = '1.0';
            expect(unitsUtils.formatUnits(value, unit)).toEqual(expected);
        });

        test('valid - number 10^6 - unit mwei', () => {
            const value = 1000000;
            const unit = 'mwei';
            const expected = '1.0';
            expect(unitsUtils.formatUnits(value, unit)).toEqual(expected);
        });

        test('valid - number 10^3 - unit kwei', () => {
            const value = 1000;
            const unit = 'kwei';
            const expected = '1.0';
            expect(unitsUtils.formatUnits(value, unit)).toEqual(expected);
        });

        test('valid - number 10^0- unit wei', () => {
            const value = 1;
            const decimals = 'wei';
            const expected = '1';
            expect(unitsUtils.formatUnits(value, decimals)).toEqual(expected);
        });

        test('valid - string decimal 10^18 - default 10^18', () => {
            const value = '123456789000000000000000000000';
            const expected = '123456789000.0';
            expect(unitsUtils.formatUnits(value)).toEqual(expected);
        });

        test('valid - string hexadecimal 10^18 - default 10^18', () => {
            const value = '0xde0b6b3a7640000';
            const expected = '1.0';
            expect(unitsUtils.formatUnits(value)).toEqual(expected);
        });
    });

    describe('formatVET', () => {
        test('bigint 10^18 = 1 VET', () => {
            const value = 1000000000000000000n;
            const expected = '1.0';
            expect(unitsUtils.formatVET(value)).toEqual(expected);
        });

        test('bigint to decimal VET ', () => {
            const value = 121235534681305942582523n;
            const expected = '121235.534681305942582523';
            expect(unitsUtils.formatVET(value)).toEqual(expected);
        });

        test('hex uppercase to decimal VET ', () => {
            const value = '0x2D1AF488AA2A245F5A8DBA8';
            const expected = '872463268.231948474782374824';
            expect(unitsUtils.formatVET(value)).toEqual(expected);
        });

        test('hex lowercase to decimal VET ', () => {
            const value = '0x2387169cc2beabf02b';
            const expected = '655.370182584678740011';
            expect(unitsUtils.formatVET(value)).toEqual(expected);
        });
    });

    describe('parseUnits', () => {
        test('ethers drop-in compatibility', () => {
            const numberStrings = [
                '0.100000000000000000',
                '0.000000000000000001',
                '0.099999999999999999',
                '0.001000000000000000'
            ];
            numberStrings.forEach((str) => {
                const expected = ethers.parseUnits(str, 18);
                const actual = unitsUtils.parseUnits(str, 18);
                expect(expected === actual).toBeTruthy();
            });
        });

        test('invalid - not a number - decimal', () => {
            const value = 'c0fee';
            expect(() => unitsUtils.parseUnits(value)).toThrowError(
                InvalidDataType
            );
        });

        test('invalid - not a number - hex', () => {
            const value = '0xcOfee';
            expect(() => unitsUtils.parseUnits(value)).toThrowError(
                InvalidDataType
            );
        });

        test('invalid - unit overflow', () => {
            const exp = '1';
            const decimals = 81;
            expect(() => unitsUtils.parseUnits(exp, decimals)).toThrowError(
                InvalidDataType
            );
        });

        test('valid - bigint - number 10^4', () => {
            const value = 1n;
            const decimals = 4;
            const expected = 10000n;
            const actual = unitsUtils.parseUnits(value, decimals);
            expect(actual).toEqual(expected);
        });

        test('valid - number - bigint 10^24', () => {
            const value = 123456.789;
            const decimals = 24n;
            const expected = 123456789000000000000000000000n;
            const actual = unitsUtils.parseUnits(value, decimals);
            expect(actual).toEqual(expected);
        });

        test('valid - number - default 10^18', () => {
            const value = 1.1;
            const expected = 1100000000000000000n;
            const actual = unitsUtils.parseUnits(value);
            expect(actual).toEqual(expected);
        });

        test('valid - number - number 10^24', () => {
            const value = '1.23456';
            const decimals = 24;
            const expected = 1234560000000000000000000n;
            const actual = unitsUtils.parseUnits(value, decimals);
            expect(actual).toEqual(expected);
        });

        test('valid - string: decimal - default 10^18', () => {
            const value = '123.456';
            const expected = 123456000000000000000n;
            const actual = unitsUtils.parseUnits(value);
            expect(actual).toEqual(expected);
        });

        test('valid - string: hex - default 10^18', () => {
            const value = '0xff';
            const expected = 255000000000000000000n;
            const actual = unitsUtils.parseUnits(value);
            expect(actual).toEqual(expected);
        });

        test('valid - number - unit wei', () => {
            const value = 1;
            const unit = 'wei';
            const expected = 1n;
            const actual = unitsUtils.parseUnits(value, unit);
            expect(actual).toEqual(expected);
        });

        test('valid - number - unit kwei', () => {
            const value = 1;
            const unit = 'kwei';
            const expected = 1000n;
            const actual = unitsUtils.parseUnits(value, unit);
            expect(actual).toEqual(expected);
        });

        test('valid - number - unit mwei', () => {
            const value = 1;
            const unit = 'mwei';
            const expected = 1000000n;
            const actual = unitsUtils.parseUnits(value, unit);
            expect(actual).toEqual(expected);
        });

        test('valid - number - unit gwei', () => {
            const value = 1;
            const unit = 'gwei';
            const expected = 1000000000n;
            const actual = unitsUtils.parseUnits(value, unit);
            expect(actual).toEqual(expected);
        });

        test('valid - number - unit szabo', () => {
            const value = 1;
            const unit = 'szabo';
            const expected = 1000000000000n;
            const actual = unitsUtils.parseUnits(value, unit);
            expect(actual).toEqual(expected);
        });

        test('valid - number - unit finney', () => {
            const value = 1;
            const unit = 'finney';
            const expected = 1000000000000000n;
            const actual = unitsUtils.parseUnits(value, unit);
            expect(actual).toEqual(expected);
        });

        test('valid - number - unit ether', () => {
            const value = 1;
            const unit = 'ether';
            const expected = 1000000000000000000n;
            const actual = unitsUtils.parseUnits(value, unit);
            expect(actual).toEqual(expected);
        });

        test('valid - number - number 10^80', () => {
            const value = 1;
            const decimals = 80;
            const expected =
                100000000000000000000000000000000000000000000000000000000000000000000000000000000n;
            const actual = unitsUtils.parseUnits(value, decimals);
            expect(actual).toEqual(expected);
        });

        test('valid - number: negative - default 10^18', () => {
            const value = -1;
            const expected = -1000000000000000000n;
            const actual = unitsUtils.parseUnits(value);
            expect(actual).toEqual(expected);
        });
    });

    describe('parseVET', () => {
        test('1 VET', () => {
            const value = '1';
            const expected = 1000000000000000000n;
            expect(unitsUtils.parseVET(value)).toEqual(expected);
        });

        test('0.1 VET', () => {
            const value = '0.1';
            const expected = 100000000000000000n;
            expect(unitsUtils.parseVET(value)).toEqual(expected);
        });

        test('12345678901234567.89 VET', () => {
            const value = '12345678901234567.89';
            const expected = 12345678901234567890000000000000000n;
            expect(unitsUtils.parseVET(value)).toEqual(expected);
        });
    });
});
