import { describe, expect, test } from '@jest/globals';
import * as nc_utils from '@noble/curves/abstract/utils';
import { BloomFilter, Hex, HexUInt, Txt } from '../../src';
import { InvalidDataType, InvalidOperation } from '@vechain/sdk-errors';

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
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions, sonarjs/no-unused-expressions
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

        test('Return a not empty filter with custom k and m', () => {
            const m = 32; // Bits per key.
            const k = BloomFilter.computeBestHashFunctionsQuantity(m);
            const keys: HexUInt[] = [];
            for (let i = 0; i < 255; i++) {
                keys.push(HexUInt.of(i));
            }
            const bf = BloomFilter.of(...keys).build(k, m);
            expect(bf).toBeInstanceOf(BloomFilter);
            expect(bf.k).toBe(k);
            expect(bf.bytes.byteLength).toEqual(1020);
        });
    });

    describe('contains method test', () => {
        test('Return false for not set members as bytes', () => {
            const bf = BloomFilter.of(...BloomFilterFixture.setA).build();
            BloomFilterFixture.setB
                .map((e) => e.bytes)
                .forEach((key) => {
                    expect(bf.contains(key)).toBe(false);
                });
        });

        test('Return false for not set members as Hex', () => {
            const bf = BloomFilter.of(...BloomFilterFixture.setA).build();
            BloomFilterFixture.setB.forEach((key) => {
                expect(bf.contains(key)).toBe(false);
            });
        });

        test('Return true for set members as bytes', () => {
            const bf = BloomFilter.of(...BloomFilterFixture.setA).build();
            BloomFilterFixture.setA
                .map((e) => e.bytes)
                .forEach((key) => {
                    expect(bf.contains(key)).toBe(true);
                });
        });

        test('Return true for set members as Hex', () => {
            const bf = BloomFilter.of(...BloomFilterFixture.setA).build();
            BloomFilterFixture.setA.forEach((key) => {
                expect(bf.contains(key)).toBe(true);
            });
        });

        test('Return true for members of a set built with custom k and m', () => {
            const m = 16; // Bits per key.
            const k = BloomFilter.computeBestHashFunctionsQuantity(m);
            const keys: HexUInt[] = [];
            for (let i = 0; i < 255; i++) {
                keys.push(HexUInt.of(i));
            }
            const bf = BloomFilter.of(...keys).build(k, m);
            keys.forEach((key) => {
                expect(bf.contains(key)).toBe(true);
            });
        });

        test('Should maintain a reasonable false positive rate', () => {
            const m = 16; // Bits per key.
            const k = BloomFilter.computeBestHashFunctionsQuantity(m);
            const size = 1024;
            const aliens: HexUInt[] = [];
            const members: HexUInt[] = [];
            for (let i = 0; i < size; i++) {
                members.push(HexUInt.of(i));
                aliens.push(HexUInt.of(size * i)); // Aliens most be values far enough from members' value.
            }
            const bf = BloomFilter.of(...members).build(k, m);
            let falsePositives = 0;
            for (let i = 0; i < size; i++) {
                if (bf.contains(aliens[i])) {
                    falsePositives++;
                }
            }
            const falsePositiveRate = falsePositives / size;
            // Uncomment for false positive rate percentage.
            // console.debug(`False positive rate: ${falsePositiveRate * 100}%`);
            expect(falsePositiveRate).toBeLessThan(0.01);
        });
    });

    describe('isJoinable method test', () => {
        test('Return false for different k values', () => {
            const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build();
            const bf2 = BloomFilter.of(...BloomFilterFixture.setA).build(16);
            expect(bf1.isJoinable(bf2)).toBeFalsy();
        });

        test('Return false for different length values', () => {
            const k = 8;
            const m1 = 32; // Number of hash functions for the first set.
            const m2 = 32 ** 2; // The number of hash functions for second set must be very different to result in different sets' sizes when k is the same.
            const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build(k, m1);
            const bf2 = BloomFilter.of(...BloomFilterFixture.setA).build(k, m2);
            expect(bf1.isJoinable(bf2)).toBeFalsy();
        });

        test('Return true for same length and k values', () => {
            const bfA = BloomFilter.of(...BloomFilterFixture.setA).build();
            const bfB = BloomFilter.of(...BloomFilterFixture.setB).build();
            expect(bfA.isJoinable(bfB)).toBeTruthy();
        });
    });

    describe('join method test', () => {
        test('Return the join set', () => {
            const bfA = BloomFilter.of(...BloomFilterFixture.setA).build();
            const bfB = BloomFilter.of(...BloomFilterFixture.setB).build();
            const bfJ = bfA.join(bfB);
            BloomFilterFixture.setA.forEach((key) => {
                expect(bfJ.contains(key)).toBe(true);
            });
            BloomFilterFixture.setB.forEach((key) => {
                expect(bfJ.contains(key)).toBe(true);
            });
        });

        test('Throw an exception when k values are different', () => {
            const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build();
            const bf2 = BloomFilter.of(...BloomFilterFixture.setA).build(16);
            expect(() => {
                bf1.join(bf2);
            }).toThrow(InvalidOperation);
        });

        test('Throw an exception when length values are different', () => {
            const k = 8;
            const m1 = 32; // Number of hash functions for the first set.
            const m2 = 32 ** 2; // The number of hash functions for second set must be very different to result in different sets' sizes when k is the same.
            const bf1 = BloomFilter.of(...BloomFilterFixture.setA).build(k, m1);
            const bf2 = BloomFilter.of(...BloomFilterFixture.setA).build(k, m2);
            expect(() => {
                bf1.join(bf2);
            }).toThrow(InvalidOperation);
        });
    });

    test('computeBestBitsPerKey (m) method test', () => {
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

    test('computeBestHashFunctionsQuantity (k) method test', () => {
        BloomFilterFixture.setK.forEach((testCase) => {
            expect(
                BloomFilter.computeBestHashFunctionsQuantity(testCase.actualK)
            ).toBe(testCase.expectedK);
        });
    });
});
