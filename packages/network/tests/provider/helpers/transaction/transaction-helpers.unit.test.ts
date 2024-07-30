import { describe, expect, test } from '@jest/globals';
import {
    getTransactionIndexTestCases,
    invalidGetTransactionIndexTestCases
} from './fixture';

import { InvalidDataType } from '@vechain/sdk-errors';
import { getTransactionIndexIntoBlock } from '../../../../src';

/**
 * Provider transaction helpers test suite
 *
 * @group unit/helpers/transaction
 */
describe('Provider Transaction Helpers', () => {
    /**
     * Test suite for getTransactionIndex
     */
    describe('getTransactionIndex', () => {
        /**
         * Test cases for getTransactionIndex
         */
        getTransactionIndexTestCases.forEach(({ block, hash, expected }) => {
            test(`should return ${expected} for ${hash}`, () => {
                const idx = getTransactionIndexIntoBlock(block, hash);
                expect(idx).toBe(expected);
            });
        });

        /**
         * Test cases for getTransactionIndex with invalid data
         */
        invalidGetTransactionIndexTestCases.forEach(({ block, hash }) => {
            test(`should throw error for ${hash}`, () => {
                expect(() =>
                    getTransactionIndexIntoBlock(block, hash)
                ).toThrowError(InvalidDataType);
            });
        });
    });
});
