import { describe, expect, test } from '@jest/globals';
import { addressUtils, bloomUtils, Hex0x } from '../../../src';
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
import {
    type Clause,
    type ExpandedBlockDetail,
    type TransactionsExpandedBlockDetail
} from '@vechain/sdk-network';

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

    test('boolUtils.getAddressesOf', () => {
        const addresses = getAddressesOf(expandedBlockDetail).filter(
            (address) => {
                return addressUtils.isAddress(address);
            }
        );
        const filter = bloomUtils.filterOf(addresses);
        console.log(filter);
        console.log(filter.length);
        addresses.forEach((address) => {
            expect(
                bloomUtils.isAddressInBloom(filter, 30, Hex0x.canon(address))
            ).toBeTruthy();
        });
    });
});

function getAddressesOf(block: ExpandedBlockDetail): string[] {
    const addresses: string[] = [block.beneficiary, block.signer];
    block.transactions.forEach(
        (transaction: TransactionsExpandedBlockDetail) => {
            transaction.clauses.forEach((clause: Clause) => {
                if (typeof clause.to === 'string') {
                    addresses.push(clause.to);
                }
            });
            addresses.push(transaction.delegator);
            addresses.push(transaction.gasPayer);
            addresses.push(transaction.origin);
            transaction.outputs.forEach((output) => {
                if (typeof output.contractAddress === 'string') {
                    addresses.push(output.contractAddress);
                }
                output.events.forEach((event) => {
                    addresses.push(event.address);
                });
                output.transfers.forEach((transfer) => {
                    addresses.push(transfer.recipient);
                    addresses.push(transfer.sender);
                });
            });
        }
    );
    return addresses;
}
