import { describe, expect, test } from '@jest/globals';
import { Hex, Revision } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';

/**
 * Test Revision class.
 * @group unit/vcdm
 */
describe('Revision class tests', () => {
    describe('Construction tests', () => {
        describe('From bigint value', () => {
            test('Return a Revision instance for a valid value', () => {
                const value = 12357n;
                const rev = Revision.of(value);
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.toString()).toEqual(value.toString());
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(-12357n)).toThrow(
                    IllegalArgumentError
                );
            });
        });

        describe('From number value', () => {
            test('Return a Revision instance for a valid value', () => {
                const value = 12357;
                const rev = Revision.of(value);
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.toString()).toEqual(value.toString());
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(-12357)).toThrow(IllegalArgumentError);
            });
        });

        describe('From string value', () => {
            test('Return a Revision instance for a valid `best`', () => {
                const value = 'best';
                const rev = Revision.of(value);
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.toString()).toEqual(value);
                expect(rev).toEqual(Revision.BEST);
            });

            test('Return a Revision instance for a valid `finalized`', () => {
                const value = 'finalized';
                const rev = Revision.of(value);
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.toString()).toEqual(value);
                expect(rev).toEqual(Revision.FINALIZED);
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(`worst`)).toThrow(
                    IllegalArgumentError
                );
            });
        });

        describe('From Hex value', () => {
            test('Return a Revision instance for a valid value', () => {
                const rev = Revision.of(Hex.of('0x0FF1CE'));
                expect(rev).toBeInstanceOf(Revision);
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(Hex.of('-0x0FF1CE'))).toThrow(
                    IllegalArgumentError
                );
            });
        });
    });
});
