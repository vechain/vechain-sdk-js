"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIFunction = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const viem_1 = require("viem");
const Hex_1 = require("../Hex");
const ABIItem_1 = require("./ABIItem");
/**
 * Represents a function call in the Function ABI.
 * @extends ABIItem
 */
class ABIFunction extends ABIItem_1.ABIItem {
    abiFunction;
    constructor(signature) {
        try {
            super(signature);
            this.abiFunction = this.signature;
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiItem('ABIFunction constructor', 'Initialization failed: Cannot create Function ABI. Function format is invalid.', {
                type: 'function',
                value: signature
            }, error);
        }
    }
    /**
     * Get the function selector.
     * @returns {string} The function selector.
     * @override {@link ABIItem#signatureHash}
     */
    get signatureHash() {
        return super.signatureHash.substring(0, 10);
    }
    /**
     * Decode data using the function's ABI.
     *
     * @param {Hex} data - Data to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    decodeData(data) {
        try {
            return (0, viem_1.decodeFunctionData)({
                abi: [this.abiFunction],
                data: data.toString()
            });
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIFunction.decodeData', 'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.', { data }, error);
        }
    }
    /**
     * Encode data using the function's ABI.
     *
     * @param dataToEncode - Data to encode.
     * @returns {Hex} Encoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeData(dataToEncode) {
        try {
            return Hex_1.Hex.of((0, viem_1.encodeFunctionData)({
                abi: [this.abiFunction],
                args: dataToEncode
            }));
        }
        catch (e) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIFunction.encodeData', 'Encoding failed: Data format is invalid. Function data does not match the expected format for ABI type encoding.', { dataToEncode }, e);
        }
    }
    /**
     * Decodes the output data from a transaction based on ABI (Application Binary Interface) specifications.
     * This method attempts to decode the given hex-like data into a readable format using the contract's interface.
     *
     * @param {Hex} data - The data to be decoded, typically representing the output of a contract function call.
     * @returns {DecodeFunctionResultReturnType} An object containing the decoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     *
     * @example
     * ```typescript
     *   const decoded = abiFunctionInstance.decodeResult(rawTransactionOutput);
     *   console.log('Decoded Output:', decoded);
     * ```
     */
    decodeResult(data) {
        try {
            const result = (0, viem_1.decodeFunctionResult)({
                abi: [this.abiFunction],
                data: data.toString()
            });
            return result;
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIFunction.decodeResult', 'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.', { data }, error);
        }
    }
    /**
     * Decodes a function output returning an array of values.
     * @param {Hex} data The data to be decoded
     * @returns {unknown[]} The decoded data as array of values
     */
    decodeOutputAsArray(data) {
        const resultDecoded = this.decodeResult(data);
        if (this.abiFunction.outputs.length > 1) {
            return this.parseObjectValues(resultDecoded);
        }
        else if (this.abiFunction.outputs.length === 1 &&
            this.abiFunction.outputs[0].type === 'tuple') {
            return [this.parseObjectValues(resultDecoded)];
        }
        return [resultDecoded];
    }
}
exports.ABIFunction = ABIFunction;
