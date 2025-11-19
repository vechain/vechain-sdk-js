"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABI = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const viem_1 = require("viem");
const Hex_1 = require("../Hex");
/**
 * Represents an ABI (Application Binary Interface).
 * @extends VeChainDataModel
 */
class ABI {
    types;
    values;
    /**
     * ABI constructor from types and values.
     *
     * @param {string | AbiParameter[]} types - A list of ABI types representing the types of the values.
     * @param {unknown[]} values - An array of values according to the specified ABI types.
     **/
    constructor(types = [], values = []) {
        this.types =
            typeof types === 'string' ? (0, viem_1.parseAbiParameters)(types) : types;
        this.values = values;
    }
    /**
     * Compares the current ABI instance with another ABI instance.
     * @param that The ABI to compare with.
     * @returns {number} A non-zero number if the current ABI is different to the other ABI or zero if they are equal.
     * @override {@link VeChainDataModel#compareTo}
     * @remark The comparison is done by comparing the types and values of the ABI instances.
     **/
    compareTo(that) {
        this.types.forEach((type, index) => {
            if (type !== that.types[index]) {
                return -1;
            }
        });
        this.values.forEach((value, index) => {
            if (value !== that.values[index]) {
                return 1;
            }
        });
        return 0;
    }
    /**
     * Checks if the current ABI object is equal to the given ABI object.
     * @param that The ABI object to compare with.
     * @returns {boolean} True if the objects are equal, false otherwise.
     * @override {@link VeChainDataModel#isEqual}
     * @remark The comparison is done by comparing the types and values of the ABI instances.
     **/
    isEqual(that) {
        return this.compareTo(that) === 0;
    }
    /**
     * Throws an exception because the ABI cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the ABI.
     * @throws {InvalidOperation} The ABI cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remark The conversion to BigInt is not supported for an ABI.
     */
    get bi() {
        throw new sdk_errors_1.InvalidOperation('ABI.bi', 'There is no big integer representation for an ABI.', { data: '' });
    }
    /**
     * Encodes the values according to the specified ABI types when creating the ABI instance.
     *
     * @returns The ABI-encoded bytes representing the given values.
     * @throws {InvalidAbiDataToEncodeOrDecode, InvalidDataType}
     */
    get bytes() {
        return this.toHex().bytes;
    }
    /**
     * Throws an exception because the ABI cannot be represented as a number.
     * @returns {bigint} The number representation of the ABI.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remark The conversion to number is not supported for an ABI.
     */
    get n() {
        throw new sdk_errors_1.InvalidOperation('ABI.n', 'There is no number representation for an ABI.', { data: '' });
    }
    /**
     * Instantiates an ABI object from the given types and values.
     * @param {string | AbiParameter[]} types ABI parameters representing the types of the values.
     * @param {unknown[]} values ABI values.
     * @returns {ABI} The ABI object with the given types and values.
     */
    static of(types, values) {
        try {
            return new ABI(types, values);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABI.of', 'Types and values must be valid ABI parameters.', {
                types,
                values
            }, error);
        }
    }
    /**
     * Decodes the ABI values from the given ABI types and encoded data.
     * @param {string| AbiParameter[]} types The list of ABI types representing the types of the values to decode.
     * @param {Hex} dataEncoded The encoded data to decode.
     * @returns An ABI instance with the decoded values.
     */
    static ofEncoded(types, dataEncoded) {
        try {
            const hexDataEncoded = Hex_1.Hex.of(dataEncoded);
            let values;
            if (typeof types === 'string') {
                const parsedAbiParams = (0, viem_1.parseAbiParameters)(types);
                values = (0, viem_1.decodeAbiParameters)(parsedAbiParams, hexDataEncoded.bytes);
            }
            else {
                values = (0, viem_1.decodeAbiParameters)([...types], hexDataEncoded.bytes);
            }
            return new ABI(types, [...values]);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABI.of', 'Decoding failed: Data must be a valid ABI type with corresponding valid data.', {
                types,
                data: dataEncoded
            }, error);
        }
    }
    /**
     * Recursively parses an object and collects the values of each attribute into an array,
     * with nested arrays for nested objects.
     * @param {object} obj - The object to parse.
     * @returns {unknown[]} An array of values from the object, with nested arrays for nested objects.
     */
    parseObjectValues(obj) {
        const values = [];
        const recursiveParse = (currentObj) => {
            const currentValues = [];
            for (const key in currentObj) {
                if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
                    const value = currentObj[key];
                    if (typeof value === 'object' && value !== null) {
                        currentValues.push(recursiveParse(value));
                    }
                    else {
                        currentValues.push(value);
                    }
                }
            }
            return currentValues;
        };
        values.push(...recursiveParse(obj));
        return values;
    }
    /**
     * It gets the first decoded value from the ABI.
     * @returns {ReturnType} The first decoded value from the ABI.
     */
    getFirstDecodedValue() {
        if (this.values[0] instanceof Object) {
            return this.parseObjectValues(this.values[0]);
        }
        return this.values[0];
    }
    /**
     * Parses an ABI to its Hex representation.
     * @returns {Hex} The Hex representation of the ABI.
     */
    toHex() {
        try {
            const abiParametersEncoded = (0, viem_1.encodeAbiParameters)(this.types, this.values);
            return Hex_1.Hex.of(abiParametersEncoded);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABI.toHex', 'Encoding failed: Data must be a valid ABI type with corresponding valid data.', {
                types: this.types,
                values: this.values
            }, error);
        }
    }
}
exports.ABI = ABI;
