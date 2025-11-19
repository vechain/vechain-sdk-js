import { Hex } from '../../Hex';
import { type VeChainDataModel } from '../../VeChainDataModel';
import { type RLPProfile } from './kind/ScalarKind';
import { type RLPInput, type RLPValidObject, type RLPValueType } from './types';
declare class RLP implements VeChainDataModel<RLP> {
    readonly encoded: Uint8Array;
    readonly decoded: RLPInput;
    protected constructor(data: RLPInput);
    protected constructor(data: Uint8Array);
    /**
     * Returns the bigint representation of the encoded data in the RLP instance.
     * @returns {bigint} The bigint representation of the encoded data.
     */
    get bi(): bigint;
    /**
     * Returns the encoded data as a Uint8Array.
     * @returns {Uint8Array} The encoded data.
     */
    get bytes(): Uint8Array;
    /**
     * Returns the number representation of the encoded data in the RLP instance.
     * @returns {number} The number representation of the encoded data.
     */
    get n(): number;
    /**
     * Compares the current RLP instance with another RLP instance.
     * @param {RLP} that The RLP instance to compare.
     * @returns 0 if the RLP instances are equal, -1/1 if they are not.
     */
    compareTo(that: RLP): number;
    /**
     * Relies on compareTo to check if the RLP instances are equal.
     * @param {RLP} that The RLP instance to compare.
     * @returns true if the RLP instances are equal, false otherwise.
     */
    isEqual(that: RLP): boolean;
    /**
     * Creates {@link Hex} instance from the RLP encoded value.
     * @returns {Hex} The Hex instance.
     */
    toHex(): Hex;
    /**
     * Returns an RLP instance from a plain value.
     * @param data - The plain data
     * @returns {RLP} The RLP instance.
     */
    static of(data: RLPInput): RLP;
    /**
     * Returns an RLP instancen from an encoded value.
     * @param {Uint8Array} encodedData - The RLP-encoded data.
     * @returns The decoded data or null if decoding fails.
     */
    static ofEncoded(encodedData: Uint8Array): RLP;
    /**
     * Handles the RLP packing of data.
     * Recursively processes through object properties or array elements to prepare data for RLP encoding.
     *
     * @param obj - The object data to be packed.
     * @param profile - Profile for encoding structures.
     * @param context - Encoding context for error tracing.
     * @returns Packed data as RLPInput.
     * @throws {InvalidRLP}
     *
     */
    protected static packData(obj: RLPValidObject, profile: RLPProfile, context: string): RLPInput;
    /**
     * Handles the RLP unpacking of data.
     * Recursively processes through packed properties or elements to prepare data post RLP decoding.
     *
     * @param packed - The packed data to be unpacked.
     * @param profile - Profile for decoding structures.
     * @param context - Decoding context for error tracing.
     * @returns Unpacked data as RLPValueType.
     * @throws {InvalidRLP}
     *
     */
    protected static unpackData(packed: RLPInput, profile: RLPProfile, context: string): RLPValueType;
}
export { RLP };
//# sourceMappingURL=RLP.d.ts.map