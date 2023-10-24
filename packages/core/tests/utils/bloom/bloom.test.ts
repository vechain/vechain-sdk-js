import { describe, expect, test } from '@jest/globals';
import { ERRORS, bloomUtils } from '../../../src/utils';
import {
    bloomTestCases,
    blooms,
    invalidAddressBloomTestCases,
    validAddressBloomTestCases,
    valueTypeBloomTestCases
} from './fixture';

/**
 * Bloom utils tests
 * @group unit/utils-bloom
 */
describe('utils/bloom', () => {
    /**
     * Check if it is a bloom filter
     */
    test('Is bloom verification', () => {
        blooms.forEach((bloom) => {
            expect(bloomUtils.isBloom(bloom.bloom)).toBe(bloom.isBloom);
        });

        // @ts-expect-error: Testing error scenario
        expect(bloomUtils.isBloom(123)).toBe(false);
    });

    /**
     * Check bloom membership
     */
    describe('Check bloom membership', () => {
        bloomTestCases.forEach(({ bloom, k, data, expected, description }) => {
            test(`returns ${expected} for ${description}`, () => {
                expect(bloomUtils.isInBloom(bloom, k, data)).toBe(expected);
            });
        });

        valueTypeBloomTestCases.forEach(
            ({ bloom, k, data, expected, description }) => {
                test(`returns ${expected} for ${description} type inside hex bloom`, () => {
                    expect(bloomUtils.isInBloom(bloom, k, data)).toBe(expected);
                });
            }
        );

        /**
         * Test for invalid bloom filter format
         */
        test('Should throw an error for invalid bloom filter format', () => {
            expect(() => {
                bloomUtils.isInBloom('0xINVALIDBLOOM', 3, '0x1234');
            }).toThrowError(ERRORS.BLOOM.INVALID_BLOOM);
        });

        /*
         * Test for non-hexadecimal data string
         */
        test('Should throw an error for non-hexadecimal data string', () => {
            expect(() => {
                bloomUtils.isInBloom('0x000000000000000000', 3, 'INVALIDHEX');
            }).toThrowError(
                ERRORS.DATA.INVALID_DATA_TYPE('a hexadecimal string')
            );
        });

        /**
         * Test for non-positive integer k
         */
        test('Should throw an error for non-positive integer k', () => {
            expect(() => {
                bloomUtils.isInBloom('0x000000000000000000', -3, '0x1234');
            }).toThrowError(ERRORS.BLOOM.INVALID_K);
        });

        /**
         * Test for non-integer k
         */
        test('Should throw an error for non-integer k', () => {
            expect(() => {
                bloomUtils.isInBloom('0x000000000000000000', 3.5, '0x1234');
            }).toThrowError(ERRORS.BLOOM.INVALID_K);
        });

        /**
         * Test for data that is not a string
         */
        test('Should throw an error for data that is not a string', () => {
            expect(() => {
                // @ts-expect-error: Intentionally passing a number to test error handling
                bloomUtils.isInBloom('0x000000000000000000', 3, 1234);
            }).toThrowError(ERRORS.DATA.INVALID_DATA_TYPE('a string'));
        });
    });

    /**
     * Check bloom membership for addresses
     */
    describe('bloomUtils.isAddressInBloom', () => {
        /**
         * Invalid address test cases
         */
        invalidAddressBloomTestCases.forEach(
            ({ bloom, k, address, expected, description }) => {
                test(`should throw an error for ${description}`, () => {
                    expect(() => {
                        bloomUtils.isAddressInBloom(bloom, k, address);
                    }).toThrowError(expected);
                });
            }
        );

        /**
         * Valid address test cases
         */
        validAddressBloomTestCases.forEach(
            ({ bloom, k, address, expected, description }) => {
                test(`should return ${expected} for ${description}`, () => {
                    expect(bloomUtils.isAddressInBloom(bloom, k, address)).toBe(
                        expected
                    );
                });
            }
        );
    });
});
