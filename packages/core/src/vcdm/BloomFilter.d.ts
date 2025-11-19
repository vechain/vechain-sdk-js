import { Hex } from './Hex';
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
declare class BloomFilter implements VeChainDataModel<BloomFilter> {
    /**
     * Return the Bloom filter structure: an array of `m` bits per key encoding if a key is not part of the structure.
     *
     * @typedef {Uint8Array} bytes
     */
    readonly bytes: Uint8Array;
    /**
     * Return the number of hash functions used to compute this Bloom filter.
     *
     * @type {number}
     */
    readonly k: number;
    /**
     * Creates a new instance of this class.
     *
     * @param {Uint8Array} bytes - The Bloom filter structure of `m` bits per key encoding if the key
     *                             likely belongs to the structure or surely doesn't.
     * @param {number} k - The number of hash functions used to compute this Bloom filter.
     *
     */
    constructor(bytes: Uint8Array, k: number);
    /**
     * Return the Bloom filter data structure represented as a {@link bigint} value.
     *
     * @returns {bigint} - The Bloom filter data structure represented as a {@link bigint} value.
     */
    get bi(): bigint;
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
    get n(): number;
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
    compareTo(that: BloomFilter): number;
    /**
     * Checks if the current BloomFilter instance is equal to another BloomFilter instance.
     *
     * @param {BloomFilter} that - The other BloomFilter instance to compare with.
     *
     * @return {boolean} - Returns true if the current BloomFilter instance is equal to the other BloomFilter instance, otherwise returns false.
     */
    isEqual(that: BloomFilter): boolean;
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
    contains(key: Hex | Uint8Array): boolean;
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
    static computeBestBitsPerKey(k: number): number;
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
    static computeBestHashFunctionsQuantity(m: number): number;
    /**
     * Checks if the current BloomFilter instance is possible to join with another BloomFilter instance.
     *
     * @param {BloomFilter} other - The BloomFilter instance to check if it is possible to join with the current instance.
     *
     * @return {boolean} - Returns true if the BloomFilter instances have the same 'k' value and 'bytes' length, false otherwise.
     */
    isJoinable(other: BloomFilter): boolean;
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
    join(other: BloomFilter): BloomFilter;
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
    static of(...keys: Hex[] | Uint8Array[]): BloomFilterBuilder;
}
/**
 * The `BloomFilterBuilder` class provides methods for constructing a Bloom filter,
 * This builder class allows you to add keys to the filter and specify its `m` (bits per key) and `k` (hash functions)
 * parameters before building it.
 *
 * @see {BloomFilter.of}
 *
 */
declare class BloomFilterBuilder {
    /**
     * The default value number of hash functions used to create {@link BloomFilter} instances.
     */
    private static readonly DEFAULT_K;
    /**
     * Map each element of the keys as likely part of the data structure of the Bloom filter to build.
     * Each key is mapped in `m` bits using `k` hash functions.
     *
     * @see {hash}
     */
    private readonly hashMap;
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
    add(...keys: Hex[] | Uint8Array[]): this;
    /**
     * Builds a Bloom filter with the specified parameters and returns it.
     *
     * @param k - The number of hash functions to use in the Bloom filter.  to BloomFilterBuilder.DEFAULT_K.
     * @param m - The number of bits per key in the Bloom filter. Defaults to the value computed by BloomFilter.computeBestBitsPerKey(k).
     *
     * @return The built Bloom filter.
     */
    build(k?: number, m?: number): BloomFilter;
}
export { BloomFilter };
//# sourceMappingURL=BloomFilter.d.ts.map