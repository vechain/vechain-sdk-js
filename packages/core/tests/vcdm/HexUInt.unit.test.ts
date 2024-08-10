import { describe, expect, test } from '@jest/globals';
import { HexUInt } from '../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Test HexUInt class.
 * @group unit/vcdm
 */
describe('HexUInt class tests', () => {
    describe('Construction tests', () => {
        test('Return an HexUInt instance if the passed argument is positive', () => {
            const exp = '0xcaffee';
            const hi = HexUInt.of(exp);
            expect(hi).toBeInstanceOf(HexUInt);
        });

        test('Throw an error if the passed argument is negative', () => {
            const exp = '-0xcaffee';
            expect(() => HexUInt.of(exp)).toThrow(InvalidDataType);
        });
    });
});
