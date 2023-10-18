import { bloom } from '@vechain-sdk/core';
import { expect } from 'expect';

// Get best value of k (number of hash functions) depending on the number of elements in the filter
const k = bloom.calculateK(100);
console.log(k);

// Create a bloom filter with 14 bits
const bloomGenerator = new bloom.Generator();

// Add number from 0 to 99 to the bloom gernator
for (let i = 0; i < 100; i++) {
    bloomGenerator.add(Buffer.from(i + '', 'utf8'));
}

// Create the filter
const bloomFilter = bloomGenerator.generate(100, k);

// Positive case (number from 0 to 99 must be present in the bloom filter)
for (let i = 0; i < 100; i++) {
    const inFilter = bloomFilter.contains(Buffer.from(i + '', 'utf8')); // All true
    expect(inFilter).toBeTruthy();
}

// Negative case (number from 100 must not be present in the bloom filter)
const notInFilter = bloomFilter.contains(Buffer.from('100', 'utf8')); // False
expect(notInFilter).toBeFalsy();
