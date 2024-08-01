/**
 * Root interface for all the classes part of the `VeChain Data Model`
 * to provide a coherent API to represent, encode, and cast data among data types.
 */
export interface VeChainDataModel<T> {
    // Properties.
    /**
     * Return this object cast to a big integer value
     * @throws InvalidCastType if this object can't cast to a big integer.
     */
    get bi(): bigint;

    /**
     * Return this object cast to a buffer of bytes.
     */
    get bytes(): Uint8Array;

    /**
     * Return this object cast to number value.
     * @throws InvalidCastType if this object can't cast to a big integer.
     */
    get n(): number;

    // Methods.
    /**
     * Compare this object with `that` in a lexicographic meaningful way.
     *
     * @param that object to compare.
     * @return a negative number if `this` < `that`, zero if `this` = `that`, a positive number if `this` > that`.
     */
    compareTo: (that: T) => number;
    isEqual: (that: T) => boolean;
}
