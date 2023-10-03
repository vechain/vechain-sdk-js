import { describe, expect, test } from '@jest/globals';
import { type Filter, Generator, calculateK } from '../src/bloom';

describe('Bloom Filter', () => {
    test('calculateK', () => {
        expect(calculateK(1)).toBe(1);
        expect(calculateK(2)).toBe(1);
        expect(calculateK(4)).toBe(2);
        expect(calculateK(8)).toBe(5);
        expect(calculateK(16)).toBe(11);
        expect(calculateK(20)).toBe(13);
        expect(calculateK(32)).toBe(22);
        expect(calculateK(64)).toBe(30);
        expect(calculateK(128)).toBe(30);
        expect(calculateK(256)).toBe(30);
        expect(calculateK(512)).toBe(30);
        expect(calculateK(1024)).toBe(30);
    });
    test('should generate correct bloom filter', () => {
        const generator = new Generator();

        const keys = ['key1', 'key2', 'key3'];

        keys.forEach((key) => {
            generator.add(Buffer.from(key));
        });

        const bitsPerKey = 20;
        const k = calculateK(bitsPerKey);

        // Generate the bloom filter
        const filter: Filter = generator.generate(bitsPerKey, k);

        expect(filter.bits.toString('hex')).toBe('96b298d634155950');
        expect(filter.bits.byteLength).toBe(8); // 64 bits
        expect(filter.k).toBe(k);

        // Validate the generated filter with the expected behavior
        keys.forEach((key) => {
            expect(filter.contains(Buffer.from(key))).toBe(true);
        });

        // Validate false positives/negatives, similar to how it's done in the Go test
        // Assuming 'falseKey1' does not exist in the filter
        expect(filter.contains(Buffer.from('falseKey1'))).toBe(false);
    });
    test('Should generate empty bloom filter when no keys are added', () => {
        const generator = new Generator();

        const bitsPerKey = 20;
        const k = calculateK(bitsPerKey);

        // Generate the bloom filter
        const filter: Filter = generator.generate(bitsPerKey, k);

        expect(filter.bits.byteLength).toBe(8);
        expect(filter.k).toBe(k);
        expect(filter.bits.toString('hex')).toBe('0000000000000000'); // 16 groups of 4 bits, all 0 -> 64 bits
    });
    test('Should generate bloom filter with byte length higher than 8 for large number of keys', () => {
        const generator = new Generator();

        const keys: string[] = [];

        for (let i = 0; i < 10; i++) {
            keys.push(`key${i}`);
        }

        keys.forEach((key) => {
            generator.add(Buffer.from(key));
        });

        const bitsPerKey = 20;
        const k = calculateK(bitsPerKey);

        // Generate the bloom filter
        const filter: Filter = generator.generate(bitsPerKey, k);

        expect(filter.bits.toString('hex')).toBe(
            'a4d641159d68d829345f86f40d50676cf042f6265072075a94'
        );
        expect(filter.bits.byteLength).toBe(25);
        expect(filter.k).toBe(k);

        expect(
            JSON.stringify(
                Buffer.from(
                    'a4d641159d68d829345f86f40d50676cf042f6265072075a94',
                    'hex'
                )
            )
        ).toBe(JSON.stringify(filter.bits));

        // Validate the generated filter with the expected behavior
        keys.forEach((key) => {
            expect(filter.contains(Buffer.from(key))).toBe(true);
        });
    });
    test('Should correctly handle non-ASCII and binary data', () => {
        const generator = new Generator();

        // UTF-8 characters and binary data
        const keys = ['🚀', '🌕', '\x00\x01\x02'];

        keys.forEach((key) => {
            generator.add(Buffer.from(key));
        });

        const bitsPerKey = 10;
        const k = calculateK(bitsPerKey);

        const filter: Filter = generator.generate(bitsPerKey, k);

        // Validate the generated filter
        keys.forEach((key) => {
            expect(filter.contains(Buffer.from(key))).toBe(true);
        });
    });
    test('Should correctly handle empty string', () => {
        const generator = new Generator();

        generator.add(Buffer.from('')); // Empty string

        const bitsPerKey = 10;
        const k = calculateK(bitsPerKey);

        const filter: Filter = generator.generate(bitsPerKey, k);

        expect(filter.contains(Buffer.from(''))).toBe(true);
    });
    test('Should maintain a reasonable false positive rate', () => {
        const generator = new Generator();
        const numKeys = 1000;

        for (let i = 0; i < numKeys; i++) {
            generator.add(Buffer.from(`key${i}`));
        }

        const bitsPerKey = 10;
        const k = calculateK(bitsPerKey);

        const filter: Filter = generator.generate(bitsPerKey, k);

        let falsePositives = 0;
        const numTests = 1000;

        for (let i = 0; i < numTests; i++) {
            if (filter.contains(Buffer.from(`falseKey${i}`))) {
                falsePositives++;
            }
        }

        const falsePositiveRate = falsePositives / numTests;

        // Uncomment for false positive rate percentage
        // console.debug(`False positive rate: ${falsePositiveRate * 100}%`);

        expect(falsePositiveRate).toBeLessThan(0.01);
    });
});
