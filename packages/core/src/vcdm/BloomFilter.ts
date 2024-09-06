import * as nc_utils from '@noble/curves/abstract/utils';
import { Blake2b256 } from './hash/Blake2b256';
import { Hex } from './Hex';
import { InvalidDataType, InvalidOperation } from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';

/**
 * A [Bloom Filter](https://en.wikipedia.org/wiki/Bloom_filter)
 * is a space-efficient probabilistic data structure
 * that is used to test whether an element is a member of a set.
 *
 * @remarks False positive matches are possible, but false negatives are not.
 *
 * @implements {VeChainDataModel<Hex>}
 */
class BloomFilter implements VeChainDataModel<BloomFilter> {
    /**
     * Return the Bloom filter structure: an array of `m` bits per key encoding if a key is not part of the structure.
     *
     * @typedef {Uint8Array} bytes
     */
    public readonly bytes: Uint8Array;

    /**
     * Return the number of hash functions used to compute this Bloom filter.
     *
     * @type {number}
     */
    public readonly k: number;

    /**
     * Creates a new instance of this class.
     *
     * @param {Uint8Array} bytes - The Bloom filter structure of `m` bits per key encoding if the key
     *                             likely belongs to the structure or surely doesn't.
     * @param {number} k - The number of hash functions used to compute this Bloom filter.
     *
     */
    constructor(bytes: Uint8Array, k: number) {
        this.bytes = bytes;
        this.k = k;
    }

    /**
     * Return the Bloom filter data structure represented as a {@link bigint} value.
     *
     * @returns {bigint} - The Bloom filter data structure represented as a {@link bigint} value.
     */
    get bi(): bigint {
        return nc_utils.bytesToNumberBE(this.bytes);
    }

    /**
     * Return the Bloom filter data structure represented as a {@link number} value.
     *
     * @returns {bigint} - The Bloom filter data structure represented as a {@link number} value.
     *
     * @throws InvalidDataType if the data structure of the bloom filter can't be represented as a number
     * because underflow or overflow number safe integer range according
     * [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format).
     *
     * @remarks Preferably use {@link bi} because the Bloom filter data structure can always be represented as a {@link bigint} value.
     */
    get n(): number {
        const bi = this.bi;
        if (Number.MIN_SAFE_INTEGER <= bi && bi <= Number.MAX_SAFE_INTEGER) {
            return Number(bi);
        }
        throw new InvalidDataType(
            'BloomFilter.n',
            'not in the safe number range',
            {
                bytes: this.bytes,
                k: this.k
            }
        );
    }

    /**
     * Compare the current BloomFilter instance with another BloomFilter instance according their
     * * {@link bytes} data structure first,
     * * {@link k} if the data structures are equal.
     *
     * @param {BloomFilter} that - The BloomFilter instance to compare with.
     *
     * @return {number} - Returns a negative number if the current instance is less than the provided instance,
     *                   returns zero if they are equal, and returns a positive number if the current instance is greater than the provided instance.
     */
    compareTo(that: BloomFilter): number {
        return this.bi < that.bi
            ? -1
            : this.bi === that.bi
              ? this.k - that.k
              : 1;
    }

    /**
     * Checks if the current BloomFilter instance is equal to another BloomFilter instance.
     *
     * @param {BloomFilter} that - The other BloomFilter instance to compare with.
     *
     * @return {boolean} - Returns true if the current BloomFilter instance is equal to the other BloomFilter instance, otherwise returns false.
     */
    isEqual(that: BloomFilter): boolean {
        return this.bi === that.bi && this.k === that.k;
    }

    /**
     * Checks if the specified key may be contained within this Bloom filter or surely isn't.
     *
     * @param {Hex|Uint8Array} key - The key to check. It can be either a Hex object or a Uint8Array.
     *
     * @return {boolean} Returns true if this Bloom filter may contain the key, otherwise returns false.
     *
     * @remarks False positive matches are possible, but false negatives are not.
     * @remarks Security auditable method, depends on
     * * {@link hash}.
     */
    public contains(key: Hex | Uint8Array): boolean {
        return distribute(
            hash(key instanceof Hex ? key.bytes : key),
            this.k,
            this.bytes.byteLength * 8,
            (index, bit) => {
                return (this.bytes[index] & bit) === bit;
            }
        );
    }

    /**
     * Calculates the optimal number of bits per key (`m` in math literature) based
     * on the number of hash functions (`k` in math literature) used to generate the Bloom Filter.
     *
     * Mathematically, `m` is approximated as `(k / ln(2))` which is simplified
     * to the higher integer close to `(m / 0.69)` for computational efficiency.
     * It also ensures that `k` is within a practical range [1, 30], hence the function
     * - returns `2` for `k = 1`,
     * - returns `44` for `k >= 30`.
     *
     * @param {number} k - The number of keys.
     *
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
     * Mathematically, `k` is approximated as `(m * ln(2))` which is simplified
     * to the lower integer close to `(m * 0.69)` for computational efficiency.
     * It also ensures that `k` stays within a practical range [1, 30].
     *
     * @param m - The number of bits per key.
     *
     * @returns The calculated optimal `k` value.
     */
    public static computeBestHashFunctionsQuantity(m: number): number {
        const k = Math.floor(m * 0.69); // m * ln(2),  0.69 =~ ln(2)
        if (k < 1) return 1;
        return k > 30 ? 30 : k;
    }

    /**
     * Checks if the current BloomFilter instance is possible to join with another BloomFilter instance.
     *
     * @param {BloomFilter} other - The BloomFilter instance to check if it is possible to join with the current instance.
     *
     * @return {boolean} - Returns true if the BloomFilter instances have the same 'k' value and 'bytes' length, false otherwise.
     */
    public isJoinable(other: BloomFilter): boolean {
        return this.k === other.k && this.bytes.length === other.bytes.length;
    }

    /**
     * Joins the current BloomFilter with another BloomFilter by performing a bitwise OR operation on the
     * data structures of the filters.
     * Both filters must have been generated with the same number of hash functions, and they must have the same length.
     *
     * @param other - The BloomFilter to join with.
     *
     * @returns A new BloomFilter that represents the result of the join operation.
     *          They keys made this and `other` filter may belong to the returned filter.
     *          Any key not part of the joined filter surely doesn't belong to the returned filter.
     *
     * @throws {InvalidOperation} If the k values of the BloomFilters are different.
     * @throws {InvalidOperation} If the length of the byte arrays are different.
     */
    public join(other: BloomFilter): BloomFilter {
        if (this.k === other.k) {
            if (this.bytes.length === other.bytes.length) {
                return new BloomFilter(
                    new Uint8Array(
                        this.bytes.map(
                            (byte, index) => byte | other.bytes[index]
                        )
                    ),
                    this.k
                );
            }
            throw new InvalidOperation(
                'BloomFilter.join',
                'different length values',
                { this: this, other }
            );
        }
        throw new InvalidOperation('BloomFilter.join', 'different k values', {
            this: this,
            other
        });
    }

    /**
     * Creates a new instance of BloomFilterBuilder and adds the specified keys to it.
     * * Call {@link BloomFilterBuilder.add} to add more keys.
     * * Call {@link BloomFilterBuilder.build} to create a new Bloom filter once
     *
     * @param {...(Hex[] | Uint8Array[])} keys - The keys to be added to the BloomFilterBuilder.
     *
     * @returns {BloomFilterBuilder} - A new instance of BloomFilterBuilder with the specified keys added.
     *
     * @remarks Security auditable method, depends on
     * * {@link BloomFilterBuilder.add}.
     */
    public static of(...keys: Hex[] | Uint8Array[]): BloomFilterBuilder {
        const builder = new BloomFilterBuilder();
        builder.add(...keys);
        return builder;
    }
} // ~ BloomFilter

/**
 * The `BloomFilterBuilder` class provides methods for constructing a Bloom filter,
 * This builder class allows you to add keys to the filter and specify its `m` (bits per key) and `k` (hash functions)
 * parameters before building it.
 *
 * @see {BloomFilter.of}
 *
 */
class BloomFilterBuilder {
    /**
     * The default value number of hash functions used to create {@link BloomFilter} instances.
     */
    private static readonly DEFAULT_K = 5;

    /**
     * Map each element of the keys as likely part of the data structure of the Bloom filter to build.
     * Each key is mapped in `m` bits using `k` hash functions.
     *
     * @see {hash}
     */
    private readonly hashMap = new Map<number, boolean>();

    /**
     * Adds one or more keys to the Bloom filter to create.
     *
     * @param {Hex[] | Uint8Array[]} keys - The keys to be added to Bloom filter to create.
     *
     * @return {this} - Returns this {@link BloomFilterBuilder} instance, the {@link this.hashMap} is updated to
     * map the keys presence in the filter data structure.
     *
     * @remarks Security auditable method, depends on
     * * {@link hash}.
     */
    public add(...keys: Hex[] | Uint8Array[]): this {
        for (const key of keys) {
            this.hashMap.set(hash(key instanceof Hex ? key.bytes : key), true);
        }
        return this;
    }

    /**
     * Builds a Bloom filter with the specified parameters and returns it.
     *
     * @param k - The number of hash functions to use in the Bloom filter.  to BloomFilterBuilder.DEFAULT_K.
     * @param m - The number of bits per key in the Bloom filter. Defaults to the value computed by BloomFilter.computeBestBitsPerKey(k).
     *
     * @return The built Bloom filter.
     */
    public build(
        k: number = BloomFilterBuilder.DEFAULT_K,
        m: number = BloomFilter.computeBestBitsPerKey(k)
    ): BloomFilter {
        // Compute bloom filter size in bytes
        let nBytes = Math.floor((this.hashMap.size * m + 7) / 8);
        // Enforce a minimum bloom filter length to reduce very high false positive rate for small n
        nBytes = nBytes < 8 ? 8 : nBytes;
        const bits = new Uint8Array(nBytes);
        // Filter bit length
        const nBits = nBytes * 8;
        for (const hash of this.hashMap.keys()) {
            distribute(hash, k, nBits, (index, bit) => {
                bits[index] |= bit;
                return true;
            });
        }
        return new BloomFilter(bits, k);
    }
} // ~ BloomFilterBuilder

/**
 * Upper limit of an unsigned 32 bits value pre-computed for sake of efficiencyto be used
 * in the {@link addAndWrapAsUInt32} function.
 */
const UINT32_LIMIT = 2 ** 32;

/**
 * Adds two numbers and wraps the result as a 32-bit unsigned integer.
 *
 * @param {number} a - The first number to add.
 * @param {number} b - The second number to add.
 *
 * @return {number} The sum of `a` and `b`, wrapped as a 32-bit unsigned integer.
 *
 * @remarks  JavaScript represents numbers using the
 * [IEEE 754 double precision 64 bits floating point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)
 * which does not automatically handle wrapping of integers.
 * This function ensures that the addition of two numbers returns a result that is wrapped to a 32-bit unsigned integer,
 * emulating the behavior of integer addition in languages with fixed-width integers.
 */
function addAndWrapAsUInt32(a: number, b: number): number {
    return (a + b) % UINT32_LIMIT;
}

/**
 * Distributes a given hash value across a set of bits.
 *
 * @param {number} hash - The hash value to distribute.
 * @param {number} k - The number of times to distribute the hash value.
 * @param {number} m - The total number of bits to distribute the hash value across.
 * @param {function} collision - The callback function to be called for each distributed bit.
 * It takes two arguments: index (the index of the byte containing the distributed bit)
 * and bit (the distributed bit itself).
 *
 * @returns {boolean} Returns true if all bits were successfully distributed, false otherwise.
 */
function distribute(
    hash: number,
    k: number,
    m: number,
    collision: (index: number, bit: number) => boolean
): boolean {
    const delta = ((hash >>> 17) | (hash << 15)) >>> 0;
    for (let i = 0; i < k; i++) {
        const bitPos = hash % m;
        if (!collision(Math.floor(bitPos / 8), 1 << bitPos % 8)) {
            return false;
        }
        hash = addAndWrapAsUInt32(hash, delta);
    }
    return true;
}

/**
 * Computes the hash of the given key using the {@link Blake2b256} algorithm.
 *
 * @param {Uint8Array} key - The key to be hashed.
 *
 * @return {number} The computed hash value as a number.
 *
 * @remarks Security auditable method, depends on
 * * {@link Blake2b256.of}.
 */
function hash(key: Uint8Array): number {
    return Number(
        nc_utils.bytesToNumberBE(Blake2b256.of(key).bytes.slice(0, 4))
    );
}

export { BloomFilter };
