import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { Hex, Revision, Txt } from '../../src';

/**
 * Test Revision class.
 * @group unit/vcdm
 */
describe('Revision class tests', () => {
    describe('isValid method tests', () => {
        describe('isValid for bigint value', () => {
            test('Return false for negative value', () => {
                expect(Revision.isValid(-12357n)).toBeFalsy();
            });

            test('Return true for positive value', () => {
                expect(Revision.isValid(12357n)).toBeTruthy();
            });
        });

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
                expect(Revision.isValid('ABadbabe')).toBeFalsy();
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

        describe('isValid for Hex value', () => {
            test('Return false negative value', () => {
                expect(Revision.isValid(Hex.of('-0xABadBabe'))).toBeFalsy();
            });

            test('Return true for positive value', () => {
                expect(Revision.isValid(Hex.of('0xABadBabe'))).toBeTruthy();
            });
        });

        describe('isValid for Txt value', () => {
            test('Return false for negative value', () => {
                expect(Revision.isValid(Txt.of('-12357'))).toBeFalsy();
            });

            test('Return false for not integer value', () => {
                expect(Revision.isValid(Txt.of('123.57'))).toBeFalsy();
            });

            test('Return false for not numeric nor `best` nor `finalized` value', () => {
                expect(Revision.isValid(Txt.of('ABadbabe'))).toBeFalsy();
            });

            test('Return true for positive value', () => {
                expect(Revision.isValid(Txt.of('12357'))).toBeTruthy();
            });

            test('Return true for `best` value', () => {
                expect(Revision.isValid(Txt.of('best'))).toBeTruthy();
            });

            test('Return true for `finalized` value', () => {
                expect(Revision.isValid(Txt.of('finalized'))).toBeTruthy();
            });
        });
    });

    describe('Construction tests', () => {
        describe('From bigint value', () => {
            test('Return a Revision instance for a valid value', () => {
                const rev = Revision.of(12357n);
                expect(rev).toBeInstanceOf(Revision);
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(-12357n)).toThrow(InvalidDataType);
            });
        });

        describe('From number value', () => {
            test('Return a Revision instance for a valid value', () => {
                const rev = Revision.of(12357);
                expect(rev).toBeInstanceOf(Revision);
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(-12357)).toThrow(InvalidDataType);
            });
        });

        describe('From string value', () => {
            test('Return a Revision instance for a valid value', () => {
                const rev = Revision.of('best');
                expect(rev).toBeInstanceOf(Revision);
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(`worst`)).toThrow(InvalidDataType);
            });
        });

        describe('From Hex value', () => {
            test('Return a Revision instance for a valid value', () => {
                const rev = Revision.of(Hex.of('0x0FF1CE'));
                expect(rev).toBeInstanceOf(Revision);
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(Hex.of('-0x0FF1CE'))).toThrow(
                    InvalidDataType
                );
            });
        });

        describe('From Txt value', () => {
            test('Return a Revision instance for a valid value', () => {
                const rev = Revision.of(Txt.of('best'));
                expect(rev).toBeInstanceOf(Revision);
            });

            test('Throw an exception for an invalid value', () => {
                expect(() => Revision.of(Txt.of('worst'))).toThrow(
                    InvalidDataType
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
                    InvalidDataType
                );
            });
        });
    });
});
