import { describe, expect, test } from '@jest/globals';
import { accountAssertionsTests } from './fixture';
import { assertIsAddress } from '../../../src';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

/**
 * Account assertions
 *
 * @group unit/utils-assertions
 */
describe('Account assertions', () => {
    /**
     * Assert is address test suite
     */
    describe('assertIsAddress', () => {
        /**
         * Valid addresses test cases
         */
        accountAssertionsTests.assertIsAddress.valid.forEach(({ value }) => {
            test(`should not throw error for assertIsAddress of ${value}`, () => {
                // Expect assertIsAddress to not throw
                expect(() => {
                    assertIsAddress('test', value);
                }).not.toThrow();
            });
        });

        /**
         * Invalid addresses test cases
         */
        accountAssertionsTests.assertIsAddress.invalid.forEach(({ value }) => {
            test(`hould throw error for assertIsAddress of ${value}`, () => {
                // Expect assertIsAddress to throw
                expect(() => {
                    assertIsAddress('test', value);
                }).toThrowError(InvalidDataTypeError);
            });
        });
    });
});
