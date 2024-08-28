import { describe, test } from '@jest/globals';
import { RationalNumber } from '../../src';

/**
 * Test Revision class.
 * @group unit/vcdm
 */
describe('Revision class tests', () => {
    describe('scale method tests', () => {
        describe('negative exponent', () => {
            test('negative exponent scale to 0', () => {
                const rn = new RationalNumber(12345000n, -3).scale();
                console.log(rn.toString());
            });

            test('negative exponent scale to negative', () => {
                const rn = new RationalNumber(12345000n, -5).scale();
                console.log(rn.toString());
            });
        });

        describe('positive exponent', () => {
            test('positive exponent = 0', () => {
                const rn = new RationalNumber(12345n, 0).scale();
                console.log(rn.toString());
            });

            test('positive exponent > 0', () => {
                const rn = new RationalNumber(12345n, 3).scale();
                console.log(rn.toString());
            });
        });
    });
    describe('toString method tests', () => {
        describe('negative range', () => {
            test('negative integer', () => {
                const rn = new RationalNumber(-12345n, 0);
                console.log(rn.toString());
            });

            test('negative decimal > -1', () => {
                const rn = new RationalNumber(-12345n, -8);
                console.log(rn.toString());
            });

            test('negative decimal < -1', () => {
                const rn = new RationalNumber(-12345n, -3);
                console.log(rn.toString());
            });
        });

        describe('positive range', () => {
            test('positive decimal < 1', () => {
                const rn = new RationalNumber(12345n, -5);
                console.log(rn.toString());
            });

            test('positive decimal > 1', () => {
                const rn = new RationalNumber(12345n, -2);
                console.log(rn.toString());
            });

            test('positive integer', () => {
                const rn = new RationalNumber(12345n, 0);
                console.log(rn.toString());
            });
        });
    });
});
