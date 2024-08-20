import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { Hex, Revision, revisionUtils, Txt } from '../../src';

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
                expect(() => Revision.of(-12357n)).toThrow(InvalidDataType);
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
                expect(() => Revision.of(-12357)).toThrow(InvalidDataType);
            });
        });

        describe('From string value', () => {
            test('Return a Revision instance for a valid `best`', () => {
                const value = 'best';
                const rev = Revision.of(value);
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.toString()).toEqual(value);
            });

            test('Return a Revision instance for a valid `finalized`', () => {
                const value = 'finalized';
                const rev = Revision.of(value);
                expect(rev).toBeInstanceOf(Revision);
                expect(rev.toString()).toEqual(value);
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

    describe('Back-compatibility tests', () => {
        /**
         * Test cases for the `isRevisionAccount` function.
         */
        const accountRevisions = [
            {
                revision: 'invalid-address',
                expected: false
            },
            {
                revision: 'finalized',
                expected: true
            },
            {
                revision: '0x34123',
                expected: true
            },
            {
                revision: '100',
                expected: true
            },
            {
                revision: 100,
                expected: true
            },
            {
                revision: '0xG8656c6c6f',
                expected: false
            },
            {
                revision: 'best',
                expected: true
            }
        ];

        /**
         * Test cases for the `isRevisionBlock` function.
         */
        const blockRevisions = [
            {
                revision: 'invalid-address',
                expected: false
            },
            {
                revision: '0x542fd',
                expected: true
            },
            {
                revision: '100',
                expected: true
            },
            {
                revision: 100,
                expected: true
            },
            {
                revision: '0xG8656c6c6f',
                expected: false
            },
            {
                revision: 'best',
                expected: true
            },
            {
                revision: 'finalized',
                expected: true
            }
        ];

        test('isBlockRevision function test', () => {
            blockRevisions.forEach(({ revision, expected }) => {
                expect(revisionUtils.isRevisionBlock(revision)).toBe(expected);
            });
        });

        /**
         * Test case for the `isRevisionAccount` function.
         */
        test('isAccountRevision', () => {
            accountRevisions.forEach(({ revision, expected }) => {
                expect(revisionUtils.isRevisionAccount(revision)).toBe(
                    expected
                );
            });
        });
    });
});
