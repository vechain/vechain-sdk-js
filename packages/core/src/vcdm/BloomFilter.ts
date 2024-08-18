import * as nc_utils from '@noble/curves/abstract/utils';
import { Blake2b256 } from '../hash';
import { Hex } from './Hex';

class BloomFilter {
    public readonly bits: Uint8Array;
    public readonly k: number;

    constructor(bits: Uint8Array, k: number) {
        this.bits = bits;
        this.k = k;
    }

    /**
     * Calculates the optimal number of bits per key (`m` in math literature) based
     * on the number of hash functions (`k` in math literature) used to generate the Bloom Filter.
     *
     * Mathematically, `bitsPerkey` is approximated as `(k / ln(2))` which is simplified
     * to the higher integer close to `(bitsPerKey / 0.69)` for computational efficiency.
     * It also ensures that `k` is within a practical range [1, 30], hence the function
     * - returns `2` for `k = 1`,
     * - returns `44` for `k >= 30`.
     *
     * @param {number} k - The number of keys.
     * @return {number} - The number of bits per key.
     */
    public static computeBestBitsPerKey(k: number): number {
        if (k <= 1) return 2;
        return k >= 30 ? 44 : Math.ceil(k / 0.69);
    }

    /**
     * Calculates the optimal number of hash functions (`k` in math literature)
     * based on bits per key (`m` in math literature).
     *
     * Mathematically, `k` is approximated as `(bitsPerKey * ln(2))` which is simplified
     * to the lower integer close to `(bitsPerKey * 0.69)` for computational efficiency.
     * It also ensures that `k` stays within a practical range [1, 30].
     *
     * @param bitsPerKey - The number of bits per key.
     * @returns The calculated optimal `k` value.
     */
    public static computeBestK(bitsPerKey: number): number {
        const k = Math.floor(bitsPerKey * 0.69); // bitsPerKey * ln(2),  0.69 =~ ln(2)
        if (k < 1) return 1;
        return k > 30 ? 30 : k;
    }

    public static of(...keys: Hex[] | Uint8Array[]): BloomFilterBuilder {
        const builder = new BloomFilterBuilder();
        builder.add(...keys);
        return builder;
    }
}

class BloomFilterBuilder {
    private static readonly DEFAULT_K = 5;
    private static readonly UINT32_LIMIT = 2 ** 32;

    private readonly hashMap = new Map<number, boolean>();

    public add(...keys: Hex[] | Uint8Array[]): this {
        for (const key of keys) {
            this.hashMap.set(
                BloomFilterBuilder.hash(key instanceof Hex ? key.bytes : key),
                true
            );
        }
        return this;
    }

    private static addAndWrapAsUInt32(a: number, b: number): number {
        return (a + b) % BloomFilterBuilder.UINT32_LIMIT;
    }

    public build(
        k: number = BloomFilterBuilder.DEFAULT_K,
        bitsPerKey: number = BloomFilter.computeBestBitsPerKey(k)
    ): BloomFilter {
        // Compute bloom filter size in bytes
        let nBytes = Math.floor((this.hashMap.size * bitsPerKey + 7) / 8);
        // Enforce a minimum bloom filter length to reduce very high false positive rate for small n
        nBytes = nBytes < 8 ? 8 : nBytes;
        const bits = new Uint8Array(nBytes);
        // Filter bit length
        const nBits = nBytes * 8;
        for (const hash of this.hashMap.keys()) {
            BloomFilterBuilder.distribute(hash, k, nBits, (index, bit) => {
                bits[index] |= bit;
                return true;
            });
        }
        return new BloomFilter(bits, k);
    }

    private static distribute(
        hash: number,
        k: number,
        nBits: number,
        cb: (index: number, bit: number) => boolean
    ): boolean {
        const delta = ((hash >>> 17) | (hash << 15)) >>> 0;
        for (let i = 0; i < k; i++) {
            const bitPos = hash % nBits;
            if (!cb(Math.floor(bitPos / 8), 1 << bitPos % 8)) {
                return false;
            }
            hash = BloomFilterBuilder.addAndWrapAsUInt32(hash, delta);
        }
        return true;
    }

    private static hash(key: Uint8Array): number {
        return Number(
            nc_utils.bytesToNumberBE(Blake2b256.of(key).bytes.slice(0, 4))
        );
    }
}

export { BloomFilter };
