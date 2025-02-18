import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { BlockId } from '../../src/vcdm/BlockId';

/**
 * Test BlockId class.
 * @group unit/vcdm
 */
describe('BlockId class tests', () => {
    describe('Construction tests', () => {
        test('Return an BlockId instance of the provided expression', () => {
            const expression = '0xcaffee';
            const expectedBlockId =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            const blockId = BlockId.of(expression);

            expect(blockId).toBeInstanceOf(BlockId);
            expect(blockId.toString()).toEqual(expectedBlockId);
        });

        test('Checks if the provided expression is a valid 32 bytes unsigned hexadecimal value', () => {
            const expression =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            expect(BlockId.isValid(expression)).toBeTruthy();
        });

        test('Throw an error if the provided argument is not an unsigned expression', () => {
            const exp = '-0xnotUnsigned';
            expect(() => BlockId.of(exp)).toThrow(InvalidDataType);
        });
    });

    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBigInt = BlockId.of(255n);
            const ofBytes = BlockId.of(Uint8Array.of(255));
            const ofHex = BlockId.of('0xff');
            const ofNumber = BlockId.of(255);
            expect(ofBigInt.toString()).toHaveLength(66);
            expect(ofBigInt.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofNumber)).toBeTruthy();
        });
    });
});
