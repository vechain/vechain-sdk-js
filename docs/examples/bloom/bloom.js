import { BloomFilter, HexUInt } from '@vechain/sdk-core';
import { expect } from 'expect';
// START_SNIPPET: BloomSnippet
// 1 - Get best value of k (bits per key)
const m = 100; // Number of hash functions used in the bloom filter,
const k = BloomFilter.computeBestHashFunctionsQuantity(m);
console.log(k);
// 2 - Create an empty bloom filter with 14 bits per key.
const bloomGenerator = BloomFilter.of();
// 3 - Add number from 0 to 99 to the bloom generator
for (let i = 0; i < 100; i++) {
    bloomGenerator.add(HexUInt.of(i).bytes);
}
// 4 - Create the filter
const bloomFilter = bloomGenerator.build(k, m);
// Positive case (number from 0 to 99 must be present in the bloom filter)
for (let i = 0; i < 100; i++) {
    const inFilter = bloomFilter.contains(HexUInt.of(i).bytes); // All true
    expect(inFilter).toBeTruthy();
}
// Negative case (number from 100 must not be present in the bloom filter)
const notInFilter = bloomFilter.contains(HexUInt.of(100).bytes); // False
expect(notInFilter).toBeFalsy();
// END_SNIPPET: BloomSnippet
