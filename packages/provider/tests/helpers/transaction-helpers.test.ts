import { describe, expect, test } from '@jest/globals';
import {
    getTransactionIndexTestCases,
    invalidGetTransactionIndexTestCases
} from './fixture';
import { getTransactionIndex } from '../../src';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

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
                const idx = getTransactionIndex(block, hash);
                expect(idx).toBe(expected);
            });
        });

        /**
         * Test cases for getTransactionIndex with invalid data
         */
        invalidGetTransactionIndexTestCases.forEach(({ block, hash }) => {
            test(`should throw error for ${hash}`, () => {
                expect(() => getTransactionIndex(block, hash)).toThrowError(
                    InvalidDataTypeError
                );
            });
        });
    });
});
