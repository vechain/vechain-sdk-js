import { describe, expect, test } from '@jest/globals';
import * as nc_utils from '@noble/curves/abstract/utils';
import { BloomFilter, Hex, Txt } from '../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

const BloomFilterFixture = {
    emptySetBytes: Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0),
    setA: [
        Hex.of(Txt.of('key.a.0').bytes),
        Hex.of(Txt.of('key.a.1').bytes),
        Hex.of(Txt.of('key.a.2').bytes)
    ],
    setABytes: Uint8Array.of(5, 42, 16, 4, 130, 8, 41, 130),
    setB: [
        Hex.of(Txt.of('key.b.0').bytes),
        Hex.of(Txt.of('key.b.1').bytes),
        Hex.of(Txt.of('key.b.2').bytes)
    ],
    setK: [
        { actualK: 1, expectedK: 1, expectedM: 2 },
        { actualK: 2, expectedK: 1, expectedM: 2 },
        { actualK: 4, expectedK: 2, expectedM: 3 },
        { actualK: 8, expectedK: 5, expectedM: 8 },
        { actualK: 16, expectedK: 11, expectedM: 16 },
        { actualK: 20, expectedK: 13, expectedM: 19 },
        { actualK: 32, expectedK: 22, expectedM: 32 },
        { actualK: 64, expectedK: 30, expectedM: 44 },
        { actualK: 128, expectedK: 30, expectedM: 44 },
        { actualK: 256, expectedK: 30, expectedM: 44 },
        { actualK: 512, expectedK: 30, expectedM: 44 },
        { actualK: 1024, expectedK: 30, expectedM: 44 }
    ]
};

/**
 * Test BloomFilter class.
 * @group unit/vcdm
 */
describe('BloomFilter class tests.', () => {
    describe('VeChain Data Model tests', () => {
        test('Return a bi value', () => {
            const bf = BloomFilter.of(...BloomFilterFixture.setA).build();
            expect(bf.bi).toEqual(
                nc_utils.bytesToNumberBE(BloomFilterFixture.setABytes)
            );
        });

        test('Return a n value', () => {
            const expected = Uint8Array.of(0, 0, 0, 32, 0, 0, 64, 0);
            const bf = BloomFilter.of(Hex.of('0xff')).build(2, 2);
            expect(bf.n).toEqual(Number(nc_utils.bytesToNumberBE(expected)));
        });

        test('Throw an exception if the filter cannot cast to n', () => {
            expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                BloomFilter.of(...BloomFilterFixture.setA).build().n;
            }).toThrow(InvalidDataType);
        });

        describe('compareTo method tests', () => {
            test('compareTo method for different k', () => {
                const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build(2);
                const bf2 = BloomFilter.of(...BloomFilterFixture.setA).build(5);
                expect(bf1.compareTo(bf2)).toBe(-1);
            });

            test('compareTo method for same k', () => {
                const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build();
                const bf2 = BloomFilter.of(...BloomFilterFixture.setB).build();
                expect(bf1.k).toBe(bf2.k);
                expect(bf1.compareTo(bf2)).toBe(-1);
            });
        });

        describe('isEqual method tests', () => {
            test('Return false', () => {
                const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build();
                const bf2 = BloomFilter.of(...BloomFilterFixture.setB).build();
                expect(bf1.isEqual(bf2)).toBe(false);
            });

            test('Return false for same k', () => {
                const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build(2);
                const bf2 = BloomFilter.of(...BloomFilterFixture.setA).build();
                expect(bf1.isEqual(bf2)).toBe(false);
            });

            test('Return true', () => {
                const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build();
                const bf2 = BloomFilter.of(...BloomFilterFixture.setA).build();
                expect(bf1.isEqual(bf2)).toBe(true);
            });
        });
    });

    describe('Construction tests', () => {
        test('Return an empty filter', () => {
            const bf = BloomFilter.of().build();
            expect(bf).toBeInstanceOf(BloomFilter);
            expect(bf.bytes).toEqual(BloomFilterFixture.emptySetBytes);
        });

        test('Return a not empty filter from bytes', () => {
            const bf = BloomFilter.of(
                ...BloomFilterFixture.setA.map((e) => e.bytes)
            ).build();
            expect(bf).toBeInstanceOf(BloomFilter);
            expect(bf.bytes).toEqual(BloomFilterFixture.setABytes);
        });

        test('Return a not empty filter from Hex', () => {
            const bf = BloomFilter.of(...BloomFilterFixture.setA).build();
            expect(bf).toBeInstanceOf(BloomFilter);
            expect(bf.bytes).toEqual(BloomFilterFixture.setABytes);
        });
    });

    test('computeBestBitsPerKey (m) test', () => {
        BloomFilterFixture.setK.forEach((testCase) => {
            expect(
                BloomFilter.computeBestBitsPerKey(
                    BloomFilter.computeBestHashFunctionsQuantity(
                        testCase.actualK
                    )
                )
            ).toBe(testCase.expectedM);
        });
    });

    test('computeBestHashFunctionsQuantity (k) test', () => {
        BloomFilterFixture.setK.forEach((testCase) => {
            expect(
                BloomFilter.computeBestHashFunctionsQuantity(testCase.actualK)
            ).toBe(testCase.expectedK);
        });
    });
});
