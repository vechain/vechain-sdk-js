import { describe, test } from '@jest/globals';
import { FPN } from '../../src';

describe('FPN class tests', () => {
    describe('absoluteValue method tests', () => {
        test('positive value', () => {
            const a = FPN.of(123.45);
            const r = a.absoluteValue();
            console.log(r);
        });

        test('positive value', () => {
            const a = FPN.of(-123.45);
            const r = a.absoluteValue();
            console.log(r);
        });
    });

    describe('compareTo method tests', () => {
        test('less than', () => {
            const a = FPN.of(123.45);
            const b = a.plus(a);
            console.log(a.comparedTo(b));
        });

        test('equal', () => {
            const a = FPN.of(123.45);
            const b = a.minus(a);
            console.log(a.comparedTo(b));
        });
    });

    describe('dividedBy method tests', () => {
        test('periodic result', () => {
            const a = FPN.of(-1);
            const b = FPN.of(3, 0n);
            const r = a.dividedBy(b);
            console.log(r);
        });
    });

    describe('exponentiatedBy method tests', () => {
        test('power of < 1', () => {
            const b = FPN.of(4, 18n);
            const e = FPN.of(-2);
            const r = b.exponentiatedBy(e);
            console.log(r);
        });

        test('power of 0', () => {
            const b = FPN.of(0.7);
            const e = FPN.of(0);
            const r = b.exponentiatedBy(e);
            console.log(r);
        });

        test('power of 1', () => {
            const b = FPN.of(0.7);
            const e = FPN.of(1);
            const r = b.exponentiatedBy(e);
            console.log(r);
        });

        test('power of > 1', () => {
            const b = FPN.of(1.5);
            const e = FPN.of(3);
            const r = b.exponentiatedBy(e);
            console.log(r);
        });
    });

    describe('minus method tests', () => {
        test('positive result', () => {
            const a = FPN.of(0.3);
            const b = FPN.of(0.1);
            const r = a.minus(b);
            console.log(r);
        });
    });

    describe('multipliedBy method tests', () => {
        test('negative auto scale', () => {
            const a = FPN.of(-3.5);
            const b = FPN.of(2, 0n);
            const r = a.multipliedBy(b);
            console.log(r);
        });
    });

    describe('plus method tests', () => {
        test('positive result', () => {
            const a = FPN.of(5.75);
            const b = FPN.of(2.5);
            const r = a.plus(b);
            console.log(r);
        });
    });

    test('scale', () => {
        const a = FPN.of(-1, 18n);
        console.log(a);
        console.log(a.scale(3n));
    });

    describe('squareRoot methods tests', () => {
        test('integer result', () => {
            const a = FPN.of(16);
            const r = a.squareRoot();
            console.log(r);
        });

        test('not integer result', () => {
            const a = FPN.of(3);
            const r = a.squareRoot();
            console.log(r);
        });
    });

    describe('toString methods tests', () => {
        test('< 1', () => {
            const n = FPN.of(0.0001);
            console.log(n.toString());
            console.log(n);
        });
        test('> 1', () => {
            const n = FPN.of(123.456);
            console.log(n.toString());
        });
    });
});
