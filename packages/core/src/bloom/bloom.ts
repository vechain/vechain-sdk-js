/**
 * Bloom filter implementation.
 *
 * A [Bloom Filter](https://en.wikipedia.org/wiki/Bloom_filter)
 * is a space-efficient probabilistic data structure
 * that is used to test whether an element is a member of a set.
 * False positive matches are possible, but false negatives are not.
 *
 * Reference: [Bloom Filter in Vechain Thor](https://github.com/vechain/thor/blob/master/thor/bloom/bloom.go).
 */
import * as utils from '@noble/curves/abstract/utils';
import { blake2b256 } from '../hash';

/**
 * Adds two numbers with wraparound behavior, treating them as unsigned 32-bit integers.
 *
 * JavaScript represents numbers using the IEEE 754 standard for floating-point arithmetic,
 * which does not automatically handle wrapping of integers. This function ensures that
 * the addition of two numbers returns a result that is wrapped to a 32-bit unsigned integer,
 * emulating the behavior of integer addition in languages with fixed-width integers.
 *
 * @param {number} a - The first number to add.
 * @param {number} b - The second number to add.
 * @return {number} The result of adding `a` and `b`, modulo 2^32.
 */
function addWithUInt32Wrap(a: number, b: number): number {
    return (a + b) % 2 ** 32;
}

/**
 * Calculates the optimal number of bits per key (`m` in math literature) based
 * on the number of hash functions (`k`) used to generate the Bloom Filter.
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
function calculateBitsPerKey(k: number): number {
    if (k <= 1) return 2;
    return k >= 30 ? 44 : Math.ceil(k / 0.69);
}

/**
 * Calculates the optimal number of hash functions (`k`) based on bits per key.
 *
 * Mathematically, `k` is approximated as `(bitsPerKey * ln(2))` which is simplified
 * to the lower integer close to `(bitsPerKey * 0.69)` for computational efficiency.
 * It also ensures that `k` stays within a practical range [1, 30].
 *
 * @param bitsPerKey - The number of bits per key.
 * @returns The calculated optimal `k` value.
 */
function calculateK(bitsPerKey: number): number {
    const k = Math.floor(bitsPerKey * 0.69); // bitsPerKey * ln(2),  0.69 =~ ln(2)
    if (k < 1) return 1;
    return k > 30 ? 30 : k;
}

/**
 * Distribute method distributes a given hash value across a set of bits.
 *
 * @param {number} hash - The hash value to distribute.
 * @param {number} k - The number of times to distribute the hash value.
 * @param {number} nBits - The total number of bits to distribute the hash value across.
 * @param {function} cb - The callback function to be called for each distributed bit.
 * It takes two arguments: index (the index of the byte containing the distributed bit)
 * and bit (the distributed bit itself).
 * @returns {boolean} Returns true if all bits were successfully distributed, false otherwise.
 */
function distribute(
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

        hash = addWithUInt32Wrap(hash, delta);
    }
    return true;
}

/**
 * Computes the hash of the given key using blake2b256 algorithm.
 *
 * Secure audit function.
 * * {@link blake2b256}
 *
 * @param {Uint8Array} key - The key to be hashed.
 * @return {number} The computed hash value as a number.
 */
function hash(key: Uint8Array): number {
    return Number(utils.bytesToNumberBE(blake2b256(key).slice(0, 4)));
}

/**
 * This class represents a Bloom filter with its associated bit array and
 * a specified number (k) of hash functions.
 */
class Filter {
    public readonly bits: Uint8Array;
    public readonly k: number;

    /**
     * Constructs a new Filter instance.
     *
     * @constructor
     * @param {Uint8Array} bits - The input array containing bits.
     * @param {number} k - The value of k.
     */
    constructor(bits: Uint8Array, k: number) {
        this.bits = bits;
        this.k = k;
    }

    /**
     * Checks if the Bloom filter may contain the specified key.
     * Note: false positives are possible, but false negatives are not.
     *
     * @param {Uint8Array} key - The key to check.
     *
     * @return {boolean} - True if the Bloom filter may contain the key, otherwise false.
     */
    public contains(key: Uint8Array): boolean {
        return distribute(
            hash(key),
            this.k,
            this.bits.byteLength * 8,
            (index, bit) => {
                return (this.bits[index] & bit) === bit;
            }
        );
    }
}

/**
 * Represents a Bloom filter generator.
 *
 * This class aids in the creation and management of Bloom filters.
 * It allows keys to be added, internally hashes them, and provides
 * a method to generate a Bloom filter based on the added keys.
 */
class Generator {
    private readonly hashes = new Map<number, boolean>();

    /**
     * Adds a key to the set of hashes.
     *
     * Secure audit function.
     * * {@link hash}
     *
     * @param {Uint8Array} key - The key to be added to the set of hashes.
     */
    public add(key: Uint8Array): void {
        this.hashes.set(hash(key), true);
    }

    /**
     * Generates a Bloom filter with the specified number of bits per key and number of hash functions.
     * The generator will be reset after generation.
     *
     * @param {number} bitsPerKey - The desired number of bits per key in the Bloom filter.
     * @param {number} k - The number of hash functions to use in the Bloom filter.
     * @returns {Filter} - The generated Bloom filter.
     */
    public generate(bitsPerKey: number, k: number): Filter {
        // Compute bloom filter size in bytes
        let nBytes = Math.floor((this.hashes.size * bitsPerKey + 7) / 8);

        // Enforce a minimum bloom filter length to reduce very high false positive rate for small n
        nBytes = nBytes < 8 ? 8 : nBytes;

        const bits = new Uint8Array(nBytes);

        // Filter bit length
        const nBits = nBytes * 8;

        for (const hash of this.hashes.keys()) {
            distribute(hash, k, nBits, (index, bit) => {
                bits[index] |= bit;
                return true;
            });
        }

        this.hashes.clear();

        return new Filter(bits, k);
    }
}

export const bloom = {
    calculateBitsPerKey,
    calculateK,
    Filter,
    Generator
};
