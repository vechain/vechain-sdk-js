export interface VeChainDataModel<T> {
    // Properties.
    /**
     * Return this object cast to a big integer.
     * @throws InvalidCastType if this object can't cast to a big integer.
     */
    get bi(): bigint;
    get bytes(): Uint8Array;
    get n(): number;
    // Methods.
    compareTo: (that: T) => number;
    isEqual: (that: T) => boolean;
}
