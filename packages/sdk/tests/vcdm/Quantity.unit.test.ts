import { describe, expect, test } from '@jest/globals';
import { Hex, Quantity } from '@common/vcdm';
import { IllegalArgumentError } from '@errors';

/**
 * Test Quantity class.
 * @group unit/vcdm
 */
describe('Quantity class tests', () => {
    describe('Construction tests', () => {
        test('Return a Quantity instance if the passed argument is zero bigint', () => {
            const q = Quantity.of(0n);
            expect(q).toBeInstanceOf(Quantity);
            expect(q.toString()).toEqual('0x0');
        });

        test('Return a Quantity instance if the passed argument is zero number', () => {
            const q = Quantity.of(0);
            expect(q).toBeInstanceOf(Quantity);
            expect(q.toString()).toEqual('0x0');
        });

        test('Return a Quantity instance if the passed argument is non-zero bigint', () => {
            const q = Quantity.of(Hex.of('0xc0c0a').bi);
            expect(q).toBeInstanceOf(Quantity);
            expect(q.toString()).toEqual('0xc0c0a');
        });

        test('Return a Quantity instance if the passed argument is non-zero number', () => {
            const q = Quantity.of(12648430);
            expect(q).toBeInstanceOf(Quantity);
            expect(q.toString()).toEqual('0xc0ffee');
        });

        test('Throw an error if the passed argument is negative bigint', () => {
            expect(() => Quantity.of(-12357n)).toThrow(IllegalArgumentError);
        });

        test('Throw an error if the passed argument is negative number', () => {
            expect(() => Quantity.of(-12357)).toThrow(IllegalArgumentError);
        });
    });
});
