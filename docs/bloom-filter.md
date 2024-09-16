---
description: Handling of the bloom filter data structure.
---

# Bloom Filter

## What is the bloom filter data structure?

This data structure was first introduced by Burton H. Bloom in 1970 and has since found extensive utilisation in various domains due to its ability to drastically reduce the need for expensive storage and computational resources. The bloom filter achieves this by representing the set membership information in a compact manner, thereby significantly reducing the memory footprint required to store the set elements.

The bloom filter remains a valuable and widely employed data structure for optimising set membership queries in scenarios where approximate answers are acceptable, and the preservation of storage and computational resources is of paramount importance. Its versatility and effectiveness makes it an indispensable tool in modern computer science and information technology applications.

## How is the bloom filter used in VeChainThor?

The VeChainThor blockchain implements the bloom filters as an integral part of its architecture to enhance the management and processing of addresses and block numbers within the ledger. By incorporating bloom filters, VeChainThor optimises the efficiency of address and block lookup operations, thereby streamlining data retrieval processes and enhancing overall system performance.

The primary purpose of the bloom filter is to efficiently determine the presence or absence of a specific address or block number within the blockchain ledger. If a query is made to ascertain the existence of an address or block number, the bloom filter promptly provides a response, indicating whether the queried element is not present in the ledger. This response is guaranteed to be accurate in such cases.

However, when the bloom filter indicates that the queried element is potentially present in the ledger, a higher level of assurance is required due to the probabilistic nature of the data structure. In these scenarios, a subsequent search operation is performed or other relevant operations are executed to further verify the presence or absence of the element with a significantly high degree of confidence.

It is important to emphasise that the bloom filter's design is intentionally engineered to prioritise query efficiency and conserve computational resources. Consequently, the potential for false positives exists, implying that in certain instances, the filter may indicate the presence of an element that is, in reality, absent from the ledger. However, these occurrences are carefully managed by selecting appropriate parameters and monitoring the trade-off between accuracy and resource optimisation.

## The impact of bloom filter

By employing bloom filters in this manner, the VeChainThor blockchain significantly reduces the computational burden associated with address and block lookup operations, resulting in improved responsiveness and heightened scalability. This, in turn, positively impacts the overall user experience and facilitates seamless integration with various applications and services built on the blockchain platform.

```typescript { name=bloom, category=example }
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
```
