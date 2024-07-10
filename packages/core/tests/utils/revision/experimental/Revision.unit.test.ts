import { HEX } from '../../../../src';
import { describe, expect, test } from '@jest/globals';
import { Revision } from '../../../../src/utils/revision/experimental/Revision';

const RevisionFixture = {
    invalid: {
        number: -4660,
        string: '-4660',
        unknown: 'not-block-nor-finalized'
    },
    valid: {
        best: 'best',
        hex: new HEX('1234'), // = 4660
        finalized: 'finalized',
        number: 4660,
        string: '4660'
    }
};

/**
 * Text Revision class.
 * @group unit/utils/revision/experimental
 */
describe('Revision class tests', () => {
    describe('static isValid method should be false', () => {
        test('static isValid method should be false for negative number', () => {
            expect(
                Revision.isValid(RevisionFixture.invalid.number)
            ).toBeFalsy();
        });

        test('static isValid method should be false for negative decimal string', () => {
            expect(
                Revision.isValid(RevisionFixture.invalid.number)
            ).toBeFalsy();
        });

        test('static isValid method should be false for string different from `best` or `finalized`', () => {
            expect(
                Revision.isValid(RevisionFixture.invalid.number)
            ).toBeFalsy();
        });
    });

    describe('static isValid method should be true', () => {
        test('static isValid method should be true for `best`', () => {
            expect(Revision.isValid(RevisionFixture.valid.best)).toBeTruthy();
        });

        test('static isValid method should be true for hex', () => {
            expect(Revision.isValid(RevisionFixture.valid.hex)).toBeTruthy();
        });

        test('static isValid method should be true for finalized', () => {
            expect(
                Revision.isValid(RevisionFixture.valid.finalized)
            ).toBeTruthy();
        });

        test('static isValid method should be true for positive number', () => {
            expect(Revision.isValid(RevisionFixture.valid.number)).toBeTruthy();
        });

        test('static isValid method should be true for decimal string', () => {
            expect(Revision.isValid(RevisionFixture.valid.string)).toBeTruthy();
        });
    });

    describe('static of method should return Revision object', () => {
        test('static of method for `best``', () => {
            const r = Revision.of(RevisionFixture.valid.best);
            expect(r).toBeInstanceOf(Revision);
            expect(r.toString()).toBe(RevisionFixture.valid.best);
        });

        test('static of method for hex', () => {
            const r = Revision.of(RevisionFixture.valid.hex);
            expect(r).toBeInstanceOf(Revision);
            expect(r.toString()).toBe(RevisionFixture.valid.number.toString());
        });

        test('static of method for `finalized`', () => {
            const r = Revision.of(RevisionFixture.valid.finalized);
            expect(r).toBeInstanceOf(Revision);
            expect(r.toString()).toBe(RevisionFixture.valid.finalized);
        });

        test('static of method for number', () => {
            const r = Revision.of(RevisionFixture.valid.number);
            expect(r).toBeInstanceOf(Revision);
            expect(r.toString()).toBe(RevisionFixture.valid.number.toString());
        });

        test('static of method should for decimal string', () => {
            const r = Revision.of(RevisionFixture.valid.string);
            expect(r).toBeInstanceOf(Revision);
            expect(r.toString()).toBe(RevisionFixture.valid.number.toString());
        });
    });
});
