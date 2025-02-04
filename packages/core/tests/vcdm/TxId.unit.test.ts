import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { TxId } from '../../src/vcdm/TxId';

/**
 * Test TxId class.
 * @group unit/vcdm
 */
describe('TxId class tests', () => {
    describe('Construction tests', () => {
        test('Return an TxId instance of the provided expression', () => {
            const expression = '0xcaffee';
            const expectedTxId =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            const txId = TxId.of(expression);

            expect(txId).toBeInstanceOf(TxId);
            expect(txId.toString()).toEqual(expectedTxId);
        });

        test('Checks if the provided expression is a valid 32 bytes unsigned hexadecimal value', () => {
            const expression =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            expect(TxId.isValid(expression)).toBeTruthy();
        });

        test('Throw an error if the provided argument is not an unsigned expression', () => {
            const exp = '-0xnotUnsigned';
            expect(() => TxId.of(exp)).toThrow(InvalidDataType);
        });
    });

    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBigInt = TxId.of(255n);
            const ofBytes = TxId.of(Uint8Array.of(255));
            const ofHex = TxId.of('0xff');
            const ofNumber = TxId.of(255);
            expect(ofBigInt.toString()).toHaveLength(66);
            expect(ofBigInt.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofNumber)).toBeTruthy();
        });
    });
});
