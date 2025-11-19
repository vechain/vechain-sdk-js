import { type AbiParameter } from 'viem';
import { Hex } from '../Hex';
import { type VeChainDataModel } from '../VeChainDataModel';
/**
 * Represents an ABI (Application Binary Interface).
 * @extends VeChainDataModel
 */
declare class ABI implements VeChainDataModel<ABI> {
    private readonly types;
    private readonly values;
    /**
     * ABI constructor from types and values.
     *
     * @param {string | AbiParameter[]} types - A list of ABI types representing the types of the values.
     * @param {unknown[]} values - An array of values according to the specified ABI types.
     **/
    protected constructor(types?: string | AbiParameter[], values?: unknown[]);
    /**
     * Compares the current ABI instance with another ABI instance.
     * @param that The ABI to compare with.
     * @returns {number} A non-zero number if the current ABI is different to the other ABI or zero if they are equal.
     * @override {@link VeChainDataModel#compareTo}
     * @remark The comparison is done by comparing the types and values of the ABI instances.
     **/
    compareTo(that: ABI): number;
    /**
     * Checks if the current ABI object is equal to the given ABI object.
     * @param that The ABI object to compare with.
     * @returns {boolean} True if the objects are equal, false otherwise.
     * @override {@link VeChainDataModel#isEqual}
     * @remark The comparison is done by comparing the types and values of the ABI instances.
     **/
    isEqual(that: ABI): boolean;
    /**
     * Throws an exception because the ABI cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the ABI.
     * @throws {InvalidOperation} The ABI cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remark The conversion to BigInt is not supported for an ABI.
     */
    get bi(): bigint;
    /**
     * Encodes the values according to the specified ABI types when creating the ABI instance.
     *
     * @returns The ABI-encoded bytes representing the given values.
     * @throws {InvalidAbiDataToEncodeOrDecode, InvalidDataType}
     */
    get bytes(): Uint8Array;
    /**
     * Throws an exception because the ABI cannot be represented as a number.
     * @returns {bigint} The number representation of the ABI.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remark The conversion to number is not supported for an ABI.
     */
    get n(): number;
    /**
     * Instantiates an ABI object from the given types and values.
     * @param {string | AbiParameter[]} types ABI parameters representing the types of the values.
     * @param {unknown[]} values ABI values.
     * @returns {ABI} The ABI object with the given types and values.
     */
    static of(types: string | AbiParameter[], values: unknown[]): ABI;
    /**
     * Decodes the ABI values from the given ABI types and encoded data.
     * @param {string| AbiParameter[]} types The list of ABI types representing the types of the values to decode.
     * @param {Hex} dataEncoded The encoded data to decode.
     * @returns An ABI instance with the decoded values.
     */
    static ofEncoded(types: string | AbiParameter[], dataEncoded: string | Uint8Array): ABI;
    /**
     * Recursively parses an object and collects the values of each attribute into an array,
     * with nested arrays for nested objects.
     * @param {object} obj - The object to parse.
     * @returns {unknown[]} An array of values from the object, with nested arrays for nested objects.
     */
    parseObjectValues(obj: object): unknown[];
    /**
     * It gets the first decoded value from the ABI.
     * @returns {ReturnType} The first decoded value from the ABI.
     */
    getFirstDecodedValue<ReturnType>(): ReturnType;
    /**
     * Parses an ABI to its Hex representation.
     * @returns {Hex} The Hex representation of the ABI.
     */
    toHex(): Hex;
}
export { ABI };
//# sourceMappingURL=ABI.d.ts.map