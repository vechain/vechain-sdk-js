export interface VCDM<T> {
    // Properties.
    /**
     * Return this object value cast to a big integer.
     * @throws InvalidDataType if this object can't cast to a big integer.
     */
    get bi(): bigint;
    get bytes(): Uint8Array;
    get n(): number;
    // Methods.
    compareTo: (that: T) => number;
    isEqual: (that: T) => boolean;
}
