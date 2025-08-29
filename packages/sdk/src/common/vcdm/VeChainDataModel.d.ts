/**
 * Root interface for all the classes part of the `VeChain Data Model`
 * to provide a coherent API to represent, encode, and cast data among data types.
 *
 * @interface
 */
export interface VeChainDataModel<T> {
    // Properties.
    /**
     * Return this instance cast to a big integer value
     * @throws InvalidOperation if this object can't cast to a big integer.
     */
    get bi(): bigint;

    /**
     * Return this instance cast to a buffer of bytes.
     */
    get bytes(): Uint8Array;

    /**
     * Return this object cast to number value.
     * @throws InvalidOperation if this object can't cast to a big integer.
     */
    get n(): number;

    // Methods.
    /**
     * Compare this instance with `that` in a lexicographic meaningful way.
     *
     * @param {T} that object to compare.
     * @return a negative number if `this` < `that`, zero if `this` = `that`, a positive number if `this` > that`.
     */
    compareTo: (that: T) => number;

    /**
     * Checks if the given value is equal to the current instance.
     *
     * @param {T} that - The value to compare.
     * @returns {boolean} - True if the values are equal, false otherwise.
     */
    isEqual: (that: T) => boolean;
}
