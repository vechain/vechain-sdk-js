import { describe, test } from '@jest/globals';
import { BloomFilter } from '../../../src/bloom/experimental/BloomFilter';
import { HEX } from '../../../src';

const BloomFilterFixture = {
    setA: [HEX.of('key.a.0'), HEX.of('key.a.1'), HEX.of('key.a.2')],
    setB: [HEX.of('key.b.0'), HEX.of('key.b.1'), HEX.of('key.b.2')]
};

describe('BloomFilter class tests.', () => {
    test('should do something', () => {
        const bf = BloomFilter.of(...BloomFilterFixture.setA).build();
        console.log(bf);
    });
});
