import * as n_utils from '@noble/curves/abstract/utils';
import { Hex } from '../../src/vcdm/Hex';
import { Txt, bloom } from '../../src';
import { describe, expect, test } from '@jest/globals';
import { bloomKTestCases } from './fixture';
import { InvalidDataType, stringifyData } from '@vechain/sdk-errors';

/**
 * Bloom filter tests
 *
 * @NOTE different from ../n_utils/bloom/bloom.test.ts.
 * This tests bloom functionality, not the n_utils.
 * @group unit/bloom
 */
describe('Bloom Filter', () => {
    /**
     * Test the composition of Bloom filters,
     * those are compatible if generated from the same `k` number of hashing functions
     * and represents the entry with the same `m` number of bits,
     * since the `k` and `m` parameters are used to compute the best length of the
     * filter, if those are equals for two different filters, the different
     * filters have the same length.
     */
    describe('compose', () => {
        const m = 20; // Bits per key.
        const k = bloom.calculateK(m);
        const keys1 = ['key1.1', 'key1.2', 'key1.3'];
        const keys2 = ['key2.1', 'key2.2', 'key2.3'];

        /**
         * Test should fail because the filters are forged with different length,
         * hence the number of bits per key entry are different.
         */
        test('compose - invalid - different length', () => {
            const gen1 = new bloom.Generator();
            keys1.forEach((key) => {
                gen1.add(Txt.of(key).bytes);
            });
            const gen2 = new bloom.Generator();
            keys2.forEach((key) => {
                gen2.add(Txt.of(key).bytes);
            });
            const filter1 = gen1.generate(m, k);
            const filter2 = gen2.generate(m * m, k);
            expect(() => {
                filter1.compose(filter2);
            }).toThrow(InvalidDataType);
        });

        /**
         * Test should fail because the filters are forged with different `k` number of
         * hashing functions.
         */
        test('compose - invalid - different k', () => {
            const gen1 = new bloom.Generator();
            keys1.forEach((key) => {
                gen1.add(Txt.of(key).bytes);
            });
            const gen2 = new bloom.Generator();
            keys2.forEach((key) => {
                gen2.add(Txt.of(key).bytes);
            });
            const filter1 = gen1.generate(m, k);
            const filter2 = gen2.generate(m, k - 1);
            expect(() => {
                filter1.compose(filter2);
            }).toThrow(InvalidDataType);
        });

        /**
         * Test should succeed suggesting all the elements of the two filters are elements
         * of the composed filter.
         */
        test('compose - valid - possibly in set', () => {
            const gen1 = new bloom.Generator();
            keys1.forEach((key) => {
                gen1.add(Txt.of(key).bytes);
            });
            const gen2 = new bloom.Generator();
            keys2.forEach((key) => {
                gen2.add(Txt.of(key).bytes);
            });
            const filter1 = gen1.generate(m, k);
            const filter2 = gen2.generate(m, k);
            const filterUnion = filter1.compose(filter2);
            keys1.forEach((key) => {
                expect(filterUnion.contains(Txt.of(key).bytes)).toBeTruthy();
            });
            keys2.forEach((key) => {
                expect(filterUnion.contains(Txt.of(key).bytes)).toBeTruthy();
            });
        });

        /**
         * Test should succeed cofirming an alien element not
         * belonging to any of the filters is not part of the composed filter.
         */
        test('compose - valid - not in set', () => {
            const gen1 = new bloom.Generator();
            keys1.forEach((key) => {
                gen1.add(Txt.of(key).bytes);
            });
            const gen2 = new bloom.Generator();
            keys2.forEach((key) => {
                gen2.add(Txt.of(key).bytes);
            });
            const filter1 = gen1.generate(m, k);
            const filter2 = gen2.generate(m, k);
            const filterUnion = filter1.compose(filter2);
            expect(filterUnion.contains(Txt.of('alien').bytes)).toBeFalsy();
        });
    });

    /**
     * Test the possibility to compose different Bloom filters,
     * those are compatible if generated from the same `k` number of hashing functions
     * and represents the entry with the same `m` number of bits,
     * since the `k` and `m` parameters are used to compute the best length of the
     * filter, if those are equals for two different filters, the different
     * filters have the same length.
     */
    describe('isComposable', () => {
        const m = 20; // Bits per key.
        const k = bloom.calculateK(m);
        const keys1 = ['key1.1', 'key1.2', 'key1.3'];
        const keys2 = ['key2.1', 'key2.2', 'key2.3'];

        /**
         * Test should return false because the filters re forged with different length.
         */
        test('isComposable - false - different length', () => {
            const gen1 = new bloom.Generator();
            keys1.forEach((key) => {
                gen1.add(Txt.of(key).bytes);
            });
            const gen2 = new bloom.Generator();
            keys2.forEach((key) => {
                gen2.add(Txt.of(key).bytes);
            });
            const filter1 = gen1.generate(m, k);
            const filter2 = gen2.generate(m * m, k);
            expect(filter1.isComposableWith(filter2)).toBeFalsy();
        });

        /**
         * Test should return flase because filters are forged with different `k` number of hashing functions.
         */
        test('isComposable - false - different k', () => {
            const gen1 = new bloom.Generator();
            keys1.forEach((key) => {
                gen1.add(Txt.of(key).bytes);
            });
            const gen2 = new bloom.Generator();
            keys2.forEach((key) => {
                gen2.add(Txt.of(key).bytes);
            });
            const filter1 = gen1.generate(m, k);
            const filter2 = gen2.generate(m, k - 1);
            expect(filter1.isComposableWith(filter2)).toBeFalsy();
        });

        /**
         * Test shold return true because the filters are generated with compatible
         * `k` and `m` parameters hence they have the same length.
         */
        test('isComposable - true', () => {
            const gen1 = new bloom.Generator();
            keys1.forEach((key) => {
                gen1.add(Txt.of(key).bytes);
            });
            const gen2 = new bloom.Generator();
            keys2.forEach((key) => {
                gen2.add(Txt.of(key).bytes);
            });
            const filter1 = gen1.generate(m, k);
            const filter2 = gen2.generate(m, k);
            expect(filter1.isComposableWith(filter2)).toBeTruthy();
        });
    });

    /**
     * Test estimate K function
     */
    test('Estimate K', () => {
        bloomKTestCases.forEach((bloomKTestCase) => {
            expect(bloom.calculateK(bloomKTestCase.calculateK)).toBe(
                bloomKTestCase.estimatedK
            );
        });
    });

    /**
     * Test estimate bitsPerKey function
     */
    test('Estimate bits per key (m)', () => {
        bloomKTestCases.forEach((bloomKTestCase) => {
            expect(
                bloom.calculateBitsPerKey(
                    bloom.calculateK(bloomKTestCase.calculateK)
                )
            ).toBe(bloomKTestCase.bitsPerKey);
        });
    });

    /**
     * Bloom filter generator tests - Correct case
     */
    test('Should generate correct bloom filter', () => {
        const generator = new bloom.Generator();

        const keys = ['key1', 'key2', 'key3'];

        keys.forEach((key) => {
            generator.add(Txt.of(key).bytes);
        });

        const bitsPerKey = 20;
        const k = bloom.calculateK(bitsPerKey);

        // Generate the bloom filter
        const filter = generator.generate(bitsPerKey, k);

        expect(Hex.of(filter.bits).hex).toBe('96b298d634155950');
        expect(filter.bits.byteLength).toBe(8); // 64 bits
        expect(filter.k).toBe(k);

        // Validate the generated filter with the expected behavior
        keys.forEach((key) => {
            expect(filter.contains(Txt.of(key).bytes)).toBe(true);
        });

        // Validate false positives/negatives, similar to how it's done in the Go test
        // Assuming 'falseKey1' does not exist in the filter
        expect(filter.contains(Txt.of('falseKey1').bytes)).toBe(false);
    });

    /**
     * Bloom filter generator tests - No keys case
     */
    test('Should generate empty bloom filter when no keys are added', () => {
        const generator = new bloom.Generator();

        const bitsPerKey = 20;
        const k = bloom.calculateK(bitsPerKey);

        // Generate the bloom filter
        const filter = generator.generate(bitsPerKey, k);

        expect(filter.bits.byteLength).toBe(8);
        expect(filter.k).toBe(k);
        expect(Hex.of(filter.bits).hex).toBe('0000000000000000'); // 16 groups of 4 bits, all 0 -> 64 bits
    });

    /**
     * Bloom filter generator tests - Large number of keys case
     */
    test('Should generate bloom filter with byte length higher than 8 for large number of keys', () => {
        const generator = new bloom.Generator();

        const keys: string[] = [];

        for (let i = 0; i < 10; i++) {
            keys.push(`key${i}`);
        }

        keys.forEach((key) => {
            generator.add(Txt.of(key).bytes);
        });

        const bitsPerKey = 20;
        const k = bloom.calculateK(bitsPerKey);

        // Generate the bloom filter
        const filter = generator.generate(bitsPerKey, k);

        expect(Hex.of(filter.bits).hex).toBe(
            'a4d641159d68d829345f86f40d50676cf042f6265072075a94'
        );
        expect(filter.bits.byteLength).toBe(25);
        expect(filter.k).toBe(k);

        expect(stringifyData(filter.bits)).toBe(
            stringifyData(
                n_utils.hexToBytes(
                    'a4d641159d68d829345f86f40d50676cf042f6265072075a94'
                )
            )
        );

        // Validate the generated filter with the expected behavior
        keys.forEach((key) => {
            expect(filter.contains(Txt.of(key).bytes)).toBe(true);
        });
    });

    /**
     * Bloom filter generator tests - Non-ASCII and binary data case
     */
    test('Should correctly handle non-ASCII and binary data', () => {
        const generator = new bloom.Generator();

        // UTF-8 characters and binary data
        const keys = ['🚀', '🌕', '\x00\x01\x02'];

        keys.forEach((key) => {
            generator.add(Txt.of(key).bytes);
        });

        const bitsPerKey = 10;
        const k = bloom.calculateK(bitsPerKey);

        expect(k).toBe(6);

        const filter = generator.generate(bitsPerKey, k);

        expect(Hex.of(filter.bits).hex).toBe('1190199325088200');

        // Validate the generated filter
        keys.forEach((key) => {
            expect(filter.contains(Txt.of(key).bytes)).toBe(true);
        });
    });

    /**
     * Bloom filter generator tests - Empty string case
     */
    test('Should correctly handle empty string', () => {
        const generator = new bloom.Generator();

        generator.add(Txt.of('').bytes); // Empty string

        const bitsPerKey = 10;
        const k = bloom.calculateK(bitsPerKey);

        const filter = generator.generate(bitsPerKey, k);

        expect(filter.contains(Txt.of('').bytes)).toBe(true);
    });

    /**
     * Bloom filter generator tests - False positive rate case
     */
    test('Should maintain a reasonable false positive rate', () => {
        const generator = new bloom.Generator();
        const numKeys = 1000;

        for (let i = 0; i < numKeys; i++) {
            generator.add(Txt.of(`key${i}`).bytes);
        }

        const bitsPerKey = 10;
        const k = bloom.calculateK(bitsPerKey);

        const filter = generator.generate(bitsPerKey, k);

        let falsePositives = 0;
        const numTests = 1000;

        for (let i = 0; i < numTests; i++) {
            if (filter.contains(Txt.of(`falseKey${i}`).bytes)) {
                falsePositives++;
            }
        }

        const falsePositiveRate = falsePositives / numTests;

        // Uncomment for false positive rate percentage
        // console.debug(`False positive rate: ${falsePositiveRate * 100}%`);

        expect(falsePositiveRate).toBeLessThan(0.01);
    });
});
