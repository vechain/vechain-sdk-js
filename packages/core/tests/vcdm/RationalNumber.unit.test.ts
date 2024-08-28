import { describe, test } from '@jest/globals';
import { RationalNumber } from '../../src';

/**
 * Test Revision class.
 * @group unit/vcdm
 */
describe('Revision class tests', () => {
    describe('plus methods tests', () => {
        test('with carry over', () => {
            const a = new RationalNumber(123n, -2);
            const b = new RationalNumber(277n, -2);
            const r = a.plus(b);
            console.log(r.toString());
        });

        test('without carry over', () => {
            const a = new RationalNumber(123n, 3);
            const b = new RationalNumber(456n, -3);
            const r = a.plus(b);
            console.log(r.toString());
        });

        /**
         * @see https://mikemcl.github.io/bignumber.js/#plus
         */
        test('bignumber.js compatibility', () => {
            const a = new RationalNumber(1n, -1);
            const b = new RationalNumber(2n, -1);
            const c = new RationalNumber(7n, -1);
            const r = a.plus(b).plus(c);
            console.log(r.toString());
        });
    });

    describe('scale method tests', () => {
        test('scale down', () => {
            const rn = new RationalNumber(12345n, -2);
            console.log(rn.toString());
            console.log(rn.scale(-4).toString());
            console.log(rn.scale().toString());
        });

        test('scale up', () => {
            const rn = new RationalNumber(12345000n, -2);
            console.log(rn.toString());
            console.log(rn.scale(5).toString());
            console.log(rn.scale().toString());
        });

        describe('negative exponent to zero', () => {
            test('negative exponent scale to 0', () => {
                const rn = new RationalNumber(12345000n, -3).scale();
                console.log(rn.toString());
            });

            test('negative exponent scale to negative', () => {
                const rn = new RationalNumber(12345000n, -5).scale();
                console.log(rn.toString());
            });
        });

        describe('positive exponent to zero', () => {
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
