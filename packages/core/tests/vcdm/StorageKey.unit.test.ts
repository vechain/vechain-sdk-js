import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { StorageKey } from '../../src/vcdm/StorageKey';

/**
 * Test StorageKey class.
 * @group unit/vcdm
 */
describe('StorageKey class tests', () => {
    describe('Construction tests', () => {
        test('Return an StorageKey instance of the provided expression', () => {
            const expression = '0xcaffee';
            const expectedStorageKey =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            const storageKey = StorageKey.of(expression);

            expect(storageKey).toBeInstanceOf(StorageKey);
            expect(storageKey.toString()).toEqual(expectedStorageKey);
        });

        test('Checks if the provided expression is a valid 32 bytes unsigned hexadecimal value', () => {
            const expression =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            expect(StorageKey.isValid(expression)).toBeTruthy();
        });

        test('Throw an error if the provided argument is not an unsigned expression', () => {
            const exp = '-0xnotUnsigned';
            expect(() => StorageKey.of(exp)).toThrow(InvalidDataType);
        });
    });

    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBigInt = StorageKey.of(255n);
            const ofBytes = StorageKey.of(Uint8Array.of(255));
            const ofHex = StorageKey.of('0xff');
            const ofNumber = StorageKey.of(255);
            expect(ofBigInt.toString()).toHaveLength(66);
            expect(ofBigInt.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofNumber)).toBeTruthy();
        });
    });
});
