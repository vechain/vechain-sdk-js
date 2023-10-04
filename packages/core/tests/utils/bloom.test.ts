import { describe, expect, test } from '@jest/globals';
import {
    ERRORS,
    isAddressInBloom,
    isBloom,
    isInBloom,
    toHexString
} from '../../src/utils';

describe('utils/bloom', () => {
    test('isBloom', () => {
        expect(isBloom('0x00000000000000000')).toBe(true);

        expect(isBloom('00000000000000000')).toBe(true);

        expect(isBloom('cceeeeeeeeee2e02')).toBe(true);

        expect(isBloom('0xcceeefaf544356660001123123eeeeeee2e02')).toBe(true);

        expect(isBloom('0xABCDEF01230431334')).toBe(true);

        expect(isBloom('0xABCdef01230431334')).toBe(false);

        expect(isBloom('0x')).toBe(false);

        expect(isBloom('')).toBe(false);

        expect(isBloom('0x+ò8nbas')).toBe(false);

        // @ts-expect-error: Testing error scenario
        expect(isBloom(123)).toBe(false);
    });

    describe('isInBloom', () => {
        const testCases = [
            {
                bloom: 'c207aca13ca010db8b5f89b3689318',
                k: 13,
                data: 'A129f34Ad3e333373425088De3e6d7C09E0B7Dab',
                expected: true,
                description: "Without '0x' prefix"
            },
            {
                bloom: '0x9c08a0c38a54ab18fa95eb1a6cedb819130e39c9e90805',
                k: 13,
                data: '0x40735a8a228fba6ce0f18001168cd6cbd982dc98',
                expected: true,
                description: "With '0x' prefix"
            },
            {
                bloom: '0x9c08a0c38a54ab18fa95eb1a6cedb819130e39c9e90805',
                k: 13,
                data: '40735a8a228fba6ce0f18001168cd6cbd982dc98',
                expected: true,
                description: "With '0x' and without '0x' prefix"
            },
            {
                bloom: '49abf7bc1aa1ba16219497d256',
                k: 13,
                data: '0xBa6B65f7A48636B3e533205d9070598b4faF6a0C',
                expected: true,
                description: "Without '0x' and with '0x' prefix"
            }
        ];

        testCases.forEach(({ bloom, k, data, expected, description }) => {
            test(`returns ${expected} for ${description}`, () => {
                expect(isInBloom(bloom, k, data)).toBe(expected);
            });
        });

        const valueTypeCases = [
            {
                bloom: 'a4d641159d68d829345f86f40d50676cf042f6265072075a94',
                k: 13,
                data: toHexString('key1'),
                expected: true,
                description: 'regular string'
            },
            {
                bloom: '1190199325088200',
                k: 6,
                data: toHexString('\x00\x01\x02'),
                expected: true,
                description: 'binary data'
            },
            {
                bloom: '0x1190199325088200',
                k: 6,
                data: toHexString('🚀'),
                expected: true,
                description: 'emoji'
            }
        ];

        valueTypeCases.forEach(({ bloom, k, data, expected, description }) => {
            test(`returns ${expected} for ${description} type inside hex bloom`, () => {
                expect(isInBloom(bloom, k, data)).toBe(expected);
            });
        });

        // Test for invalid bloom filter format
        test('should throw an error for invalid bloom filter format', () => {
            expect(() => {
                isInBloom('0xINVALIDBLOOM', 3, '0x1234');
            }).toThrowError(ERRORS.BLOOM.INVALID_BLOOM);
        });

        // Test for non-hexadecimal data string
        test('should throw an error for non-hexadecimal data string', () => {
            expect(() => {
                isInBloom('0x000000000000000000', 3, 'INVALIDHEX');
            }).toThrowError(
                ERRORS.DATA.INVALID_DATA_TYPE('a hexadecimal string')
            );
        });

        // Test for non-positive integer k
        test('should throw an error for non-positive integer k', () => {
            expect(() => {
                isInBloom('0x000000000000000000', -3, '0x1234');
            }).toThrowError(ERRORS.BLOOM.INVALID_K);
        });

        // Test for non-integer k
        test('should throw an error for non-integer k', () => {
            expect(() => {
                isInBloom('0x000000000000000000', 3.5, '0x1234');
            }).toThrowError(ERRORS.BLOOM.INVALID_K);
        });

        // Test for data that is not a string
        test('should throw an error for data that is not a string', () => {
            expect(() => {
                // @ts-expect-error: Intentionally passing a number to test error handling
                isInBloom('0x000000000000000000', 3, 1234);
            }).toThrowError(ERRORS.DATA.INVALID_DATA_TYPE('a string'));
        });
    });

    describe('isAddressInBloom', () => {
        const invalidAddressTestCases = [
            {
                bloom: 'c207aca13ca010db8b5f89b3689318',
                k: 13,
                address: '0xINVALIDADDRESS',
                expected: ERRORS.ADDRESS.INVALID_ADDRESS,
                description: 'invalid address'
            },
            {
                bloom: 'c207aca13ca010db8b5f89b3689318',
                k: 13,
                address: 'INVALIDADDRESS',
                expected: ERRORS.ADDRESS.INVALID_ADDRESS,
                description: 'invalid address without 0x prefix'
            },
            {
                bloom: 'c207aca13ca010db8b5f89b3689318',
                k: 13,
                address: '0xc9318',
                expected: ERRORS.ADDRESS.INVALID_ADDRESS,
                description: 'invalid address too short'
            }
        ];

        invalidAddressTestCases.forEach(
            ({ bloom, k, address, expected, description }) => {
                test(`should throw an error for ${description}`, () => {
                    expect(() => {
                        isAddressInBloom(bloom, k, address);
                    }).toThrowError(expected);
                });
            }
        );

        const validAddressTestCases = [
            {
                bloom: '0x1c111c0c92a9413c38db871299fd72155b79d99b39c819',
                k: 13,
                address: '0xF6C4EE6946cE0c1e2154324026b4b2f16221e733',
                expected: true,
                description: 'valid address with 0x prefix'
            },
            {
                bloom: '0x1c111c0c92a9413c38db871299fd72155b79d99b39c819',
                k: 13,
                address: '0xDafCA4A51eA97B3b5F21171A95DAbF540894a55A',
                expected: true,
                description: 'valid address with 0x prefix'
            }
        ];

        validAddressTestCases.forEach(
            ({ bloom, k, address, expected, description }) => {
                test(`should return ${expected} for ${description}`, () => {
                    expect(isAddressInBloom(bloom, k, address)).toBe(expected);
                });
            }
        );
    });
});
