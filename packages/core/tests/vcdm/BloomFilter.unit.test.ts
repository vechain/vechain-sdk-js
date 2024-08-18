import { describe, test } from '@jest/globals';
import { BloomFilter, Hex, Txt } from '../../src';

const BloomFilterFixture = {
    setA: [
        Hex.of(Txt.of('key.a.0').bytes),
        Hex.of(Txt.of('key.a.1').bytes),
        Hex.of(Txt.of('key.a.2').bytes)
    ],
    setB: [
        Hex.of(Txt.of('key.b.0').bytes),
        Hex.of(Txt.of('key.b.1').bytes),
        Hex.of(Txt.of('key.b.2').bytes)
    ]
};

describe('BloomFilter class tests.', () => {
    test('should do something', () => {
        const bf = BloomFilter.of(...BloomFilterFixture.setA).build();
        console.log(bf);
    });
});
