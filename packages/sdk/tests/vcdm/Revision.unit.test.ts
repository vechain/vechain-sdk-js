import { describe, expect, test } from '@jest/globals';
import { Hex, Revision, Txt } from '@common/vcdm';
import { IllegalArgumentError } from '@errors';

/**
 * Test Revision class.
 * @group unit/vcdm
 */
describe('Revision class tests', () => {
    describe('isValid method tests', () => {
        describe('isValid for number value', () => {
            test('Return false for negative value', () => {
                expect(Revision.isValid(-12357)).toBeFalsy();
            });

            test('Return false for not integer value', () => {
                expect(Revision.isValid(123.57)).toBeFalsy();
            });

            test('Return true for positive value', () => {
                expect(Revision.isValid(12357)).toBeTruthy();
            });
        });

        describe('isValid for string value', () => {
            test('Return false for negative value', () => {
                expect(Revision.isValid('-12357')).toBeFalsy();
            });

            test('Return false for not integer value', () => {
                expect(Revision.isValid('123.57')).toBeFalsy();
            });

            test('Return false for not numeric nor `best` nor `finalized` value', () => {
                expect(Revision.isValid('ABadBabe')).toBeFalsy();
            });

            test('Return false for negative hex value', () => {
                expect(Revision.isValid('0x-ABadBabe')).toBeFalsy();
            });

            test('Return true for positive hex value', () => {
                expect(Revision.isValid('0xABadBabe')).toBeTruthy();
            });

            test('Return true for positive value', () => {
                expect(Revision.isValid('12357')).toBeTruthy();
            });

            test('Return true for `best` value', () => {
                expect(Revision.isValid('best')).toBeTruthy();
            });

            test('Return true for `finalized` value', () => {
                expect(Revision.isValid('finalized')).toBeTruthy();
            });
        });
    });

    describe('Construction tests', () => {
        describe('From bigint value', () => {
            test('Return a Revision instance for a valid value', () => {
                const value = 12357n;
                const rev = Revision.of(value);
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.bi).toEqual(value);
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
                expect(rev.n).toEqual(value);
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

            test('Return a Revision instance for a valid decimal value', () => {
                const value = 12357;
                const rev = Revision.of(value.toString());
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.n).toEqual(value);
            });

            test('Return a Revision instance for a valid hex value', () => {
                const value = '0xff';
                const rev = Revision.of(value);
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.n).toEqual(255);
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

        describe('From Uint8Array value', () => {
            test('Return a Revision instance for a valid value', () => {
                const rev = Revision.of(Txt.of('best').bytes);
                expect(rev).toBeInstanceOf(Revision);
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(Txt.of('worst').bytes)).toThrow(
                    IllegalArgumentError
                );
            });
        });
    });
});
