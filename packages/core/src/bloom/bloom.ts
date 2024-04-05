/**
 * Bloom filter implementation.
 *
 * A Bloom filter is a space-efficient probabilistic data structure
 * that is used to test whether an element is a member of a set.
 * False positive matches are possible, but false negatives are not.
 *
 * Reference: https://github.com/vechain/thor/blob/master/thor/bloom/bloom.go
 */

import { blake2b256 } from '../hash';
import { Buffer } from 'buffer';

/**
 * This class represents a Bloom filter with its associated bit array and
 * a specified number (k) of hash functions.
 */
class Filter {
    public readonly bits: Buffer;
    public readonly k: number;

    /**
     * Constructs a new Filter instance.
     * @param bits - The bit array used in the Bloom filter.
     * @param k - The number of hash functions to be used.
     */
    constructor(bits: Buffer, k: number) {
        this.bits = bits;
        this.k = k;
    }

    /**
     * Checks if the given key might be contained in the set.
     * Note: false positives are possible, but false negatives are not.
     * @param key - The key to be checked.
     * @returns A boolean indicating whether the key might be contained in the set.
     */
    public contains(key: Buffer): boolean {
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
 * Performs addition of two numbers and ensures the result is a 32-bit unsigned integer.
 *
 * JavaScript represents numbers using the IEEE 754 standard for floating-point arithmetic,
 * which does not automatically handle wrapping of integers. This function ensures that
 * the addition of two numbers returns a result that is wrapped to a 32-bit unsigned integer,
 * emulating the behavior of integer addition in languages with fixed-width integers.
 *
 * @param a - The first number to be added.
 * @param b - The second number to be added.
 * @returns The sum of `a` and `b`, modulo 2^32.
 */
function addWithUInt32Wrap(a: number, b: number): number {
    return (a + b) % 2 ** 32;
}

/**
 * Generates a hash value for the given key.
 * @param key - The key to be hashed.
 * @returns The hash value.
 */
function hash(key: Buffer): number {
    // Convert key to Uint8Array
    const uint8ArrayKey = new Uint8Array(key);

    // Compute hash using blake2b256
    const hash = Buffer.from(blake2b256(uint8ArrayKey));

    return hash.readUInt32BE(0);
}

/**
 * Distributes bits in the Bloom filter based on the hash of the key.
 *
 * Specifically, bit-shifting is employed to construct delta, which
 * manipulates the hash in successive iterations, thereby ensuring a uniform
 * distribution of hash values. This facilitates reducing collisions and hence,
 * diminishing the probability of false positives.
 *
 * @param hash - The hash value of the key.
 * @param k - The number of hash functions to be used.
 * @param nBits - The total number of bits in the Bloom filter.
 * @param cb - The callback function to be invoked with the index and bit.
 * @returns A boolean indicating whether the distribution was successful.
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
 * Generator class for creating and managing Bloom filters.
 *
 * This class aids in the creation and management of Bloom filters.
 * It allows keys to be added, internally hashes them, and provides
 * a method to generate a Bloom filter based on the added keys.
 */
class Generator {
    private readonly hashes = new Map<number, boolean>();

    /**
     * Adds a key to the generator's internal map for later Bloom filter generation.
     * @param key - The key to be added.
     */
    public add(key: Buffer): void {
        this.hashes.set(hash(key), true);
    }

    /**
     * Generates a variable-length Bloom filter based on the bits per key and count of keys.
     * The generator will be reset after generation.
     *
     * @param bitsPerKey - The number of bits per key.
     * @param k - The number of hash functions to be used (count of keys).
     * @returns A new Filter instance.
     */
    public generate(bitsPerKey: number, k: number): Filter {
        // Compute bloom filter size in bytes
        let nBytes = Math.floor((this.hashes.size * bitsPerKey + 7) / 8);

        // Enforce a minimum bloom filter length to reduce very high false positive rate for small n
        nBytes = nBytes < 8 ? 8 : nBytes;

        const bits = Buffer.alloc(nBytes);

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

/**
 * Calculates the optimal number of hash functions (`k`) based on bits per key.
 *
 * Mathematically, `k` is approximated as `(bitsPerKey * ln(2))` which is simplified
 * to `(bitsPerKey * 0.69)` for computational efficiency.
 * It also ensures that `k` stays within a practical range [1, 30].
 *
 * @param bitsPerKey - The number of bits per key.
 * @returns The calculated optimal `k` value.
 */
function calculateK(bitsPerKey: number): number {
    const k = Math.floor((bitsPerKey * 69) / 100); // bitsPerKey * ln(2),  0.69 =~ ln(2)
    if (k < 1) return 1;
    return k > 30 ? 30 : k;
}

export const bloom = {
    Generator,
    Filter,
    calculateK
};
