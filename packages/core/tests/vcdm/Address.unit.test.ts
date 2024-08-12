import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { Address } from '../../src';

/**
 * Test Address class.
 * @group unit/vcdm
 */
describe('Address class tests', () => {
    describe('Construction tests', () => {
        test('Return an Address instance if the passed argument is valid', () => {
            const exp = '0xcfb79a9c950b78e14c43efa621ebcf9660dbe01f';
            const address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
        });
        test('Throw an error if the passed argument is negative', () => {
            const exp = '-0xcaffee';
            expect(() => Address.of(exp)).toThrow(InvalidDataType);
        });
    });
});
