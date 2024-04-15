import { describe, expect, test } from '@jest/globals';
import { addressUtils, bloom, bloomUtils, Hex0x } from '../../../src';
import {
    bloomTestCases,
    blooms,
    invalidAddressBloomTestCases,
    validAddressBloomTestCases,
    valueTypeBloomTestCases,
    expandedBlockDetail
} from './fixture';
import {
    InvalidBloomError,
    InvalidDataTypeError,
    InvalidKError
} from '@vechain/sdk-errors';

/**
 * Bloom utils tests
 * @group unit/utils-bloom
 */
describe('utils/bloom', () => {
    test('bloomUtils.addressesOf', () => {
        const expected = [
            '0x0000000000000000000000000000456e65726779',
            '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
            '0x1eef8963e1222417af4dac0d98553abddb4a76b5',
            '0x23a46368e4acc7bb2fe0afeb054def51ec56aa74',
            '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
            '0x576da7124c7bb65a692d95848276367e5a844d95',
            '0x5db3c8a942333f6468176a870db36eef120a34dc',
            '0x6298c7a54720febdefd741d0899d287c70954c68',
            '0x95fe74d1ae072ee45bdb09879a157364e5341565',
            '0x9a107a75cff525b033a3e53cadafe3d193b570ec',
            '0xa416bdda32b00e218f08ace220bab512c863ff2f',
            '0xb2c20a6de401003a671659b10629eb82ff254fb8',
            '0xb7591602c0c9d525bc3a7cf3c729fd91b8bf5bf6',
            '0xbeae4bef0121f11d269aedf6adb227259d4314ad'
        ];
        bloomUtils
            .addressesOf(expandedBlockDetail)
            .filter((address) => {
                return addressUtils.isAddress(address); // Remove empty addresses.
            })
            .forEach((actual) => {
                expect(expected.includes(actual)).toBeTruthy();
            });
    });

    test('boolUtils.filterOf - bit per key - default', () => {
        const addresses = bloomUtils
            .addressesOf(expandedBlockDetail)
            .filter((address) => {
                return addressUtils.isAddress(address);
            });
        const filter = bloomUtils.filterOf(addresses);
        addresses.forEach((address) => {
            expect(
                bloomUtils.isAddressInBloom(filter, 30, Hex0x.canon(address))
            ).toBeTruthy();
        });
    });

    test('boolUtils.filterOf -  bit per key - set', () => {
        const addresses = bloomUtils
            .addressesOf(expandedBlockDetail)
            .filter((address) => {
                return addressUtils.isAddress(address);
            });
        const filter = bloomUtils.filterOf(addresses, 16);
        addresses.forEach((address) => {
            expect(
                bloomUtils.isAddressInBloom(
                    filter,
                    bloom.calculateK(16),
                    Hex0x.canon(address)
                )
            ).toBeTruthy();
        });
    });

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
            }).toThrowError(InvalidBloomError);
        });

        /*
         * Test for non-hexadecimal data string
         */
        test('Should throw an error for non-hexadecimal data string', () => {
            expect(() => {
                bloomUtils.isInBloom('0x000000000000000000', 3, 'INVALIDHEX');
            }).toThrowError(InvalidDataTypeError);
        });

        /**
         * Test for non-positive integer k
         */
        test('Should throw an error for non-positive integer k', () => {
            expect(() => {
                bloomUtils.isInBloom('0x000000000000000000', -3, '0x1234');
            }).toThrowError(InvalidKError);
        });

        /**
         * Test for non-integer k
         */
        test('Should throw an error for non-integer k', () => {
            expect(() => {
                bloomUtils.isInBloom('0x000000000000000000', 3.5, '0x1234');
            }).toThrowError(InvalidKError);
        });

        /**
         * Test for data that is not a string
         */
        test('Should throw an error for data that is not a string', () => {
            expect(() => {
                // @ts-expect-error: Intentionally passing a number to test error handling
                bloomUtils.isInBloom('0x000000000000000000', 3, 1234);
            }).toThrowError(InvalidDataTypeError);
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
