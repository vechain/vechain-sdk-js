import { describe, expect, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { fail } from 'assert';
import { Address } from '../../src';

/**
 * Test Address class.
 * @group unit/vcdm
 */
describe('Address class tests', () => {
    describe('Construction tests', () => {
        test('Return an Address instance if the passed argument is valid', () => {
            let exp = '0xcfb79a9c950b78e14c43efa621ebcf9660dbe01f';
            let address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
            exp = '0xCfb79a9c950b78E14c43efa621ebcf9660dbe01F';
            address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
            exp = '0xCFB79A9C950B78E14C43EFA621EBCF9660DBE01F';
            address = Address.of(exp);
            expect(address).toBeInstanceOf(Address);
        });
        test('Throw an error if the passed argument is an invalid address', () => {
            let exp = '-0xcaffee';
            try {
                Address.of(exp);
                fail('This should have thrown an error');
            } catch (e) {
                expect(e).toBeInstanceOf(InvalidDataType);
                if (e instanceof InvalidDataType) {
                    expect(e.message).toBe(
                        `Method 'HexUInt.of' failed.` +
                            `\n-Reason: 'not a hexadecimal positive integer expression'` +
                            `\n-Parameters: \n\t{"exp":"${exp}"}` +
                            `\n-Internal error: ` +
                            `\n\tMethod 'HexUInt.constructor' failed.` +
                            `\n-Reason: 'not positive'` +
                            `\n-Parameters: \n\t{"hi":"${exp}"}` +
                            `\n-Internal error: \n\tNo internal error given`
                    );
                }
            }
            exp = '0xcaffee';
            try {
                Address.of(exp);
                fail('This should have thrown an error');
            } catch (e) {
                expect(e).toBeInstanceOf(InvalidDataType);
                if (e instanceof InvalidDataType) {
                    expect(e.message).toBe(
                        `Method 'Address.constructor' failed.` +
                            `\n-Reason: 'not a valid address'` +
                            `\n-Parameters: \n\t{"huint":"${exp}"}` +
                            `\n-Internal error: \n\tNo internal error given`
                    );
                }
            }
        });
    });
});
