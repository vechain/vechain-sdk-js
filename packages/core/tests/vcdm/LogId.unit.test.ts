import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { LogId } from '../../src/vcdm/LogId';

/**
 * Test LogId class.
 * @group unit/vcdm
 */
describe('LogId class tests', () => {
    describe('Construction tests', () => {
        test('Return an LogId instance of the provided expression', () => {
            const expression = '0xcaffee';
            const expectedLogId =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            const logId = LogId.of(expression);

            expect(logId).toBeInstanceOf(LogId);
            expect(logId.toString()).toEqual(expectedLogId);
        });

        test('Checks if the provided expression is a valid 32 bytes unsigned hexadecimal value', () => {
            const expression =
                '0x0000000000000000000000000000000000000000000000000000000000caffee';

            expect(LogId.isValid(expression)).toBeTruthy();
        });

        test('Throw an error if the provided argument is not an unsigned expression', () => {
            const exp = '-0xnotUnsigned';
            expect(() => LogId.of(exp)).toThrow(InvalidDataType);
        });
    });

    describe('Polymorphism equivalence', () => {
        test('Equal for bigint, bytes, hex expression, number', () => {
            const ofBigInt = LogId.of(255n);
            const ofBytes = LogId.of(Uint8Array.of(255));
            const ofHex = LogId.of('0xff');
            const ofNumber = LogId.of(255);
            expect(ofBigInt.toString()).toHaveLength(66);
            expect(ofBigInt.isEqual(ofBytes)).toBeTruthy();
            expect(ofBytes.isEqual(ofHex)).toBeTruthy();
            expect(ofHex.isEqual(ofNumber)).toBeTruthy();
        });
    });
});
