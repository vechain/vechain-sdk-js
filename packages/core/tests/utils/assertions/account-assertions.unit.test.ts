import { describe, expect, test } from '@jest/globals';
import { accountAssertionsTests } from './fixture';

import { InvalidDataTypeError } from '@vechain/sdk-errors';
import { assertIsAddress } from '../../../src';

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
            test(`Should throw error for assertIsAddress of ${value}`, () => {
                // Expect assertIsAddress to throw
                expect(() => {
                    assertIsAddress('test', value);
                }).toThrowError(InvalidDataTypeError);
            });
        });
    });
});
