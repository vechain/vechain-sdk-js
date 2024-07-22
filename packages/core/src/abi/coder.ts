import { type BytesLike, type ParamType } from './types';
import { ethers } from 'ethers';
import { fragment } from './fragment';
import { InvalidAbiDataToEncodeOrDecode } from '@vechain/sdk-errors';

/**
 * Default AbiCoder instance from ethers.js.
 */
const ethersCoder = new ethers.AbiCoder();

/**
 * Encodes a parameter value.
 *
 * @note `ValueType` is used to explicitly specify the type of the value to encode.
 *
 * @param type - Type of the parameter.
 * @param value - Value to encode.
 * @returns Encoded parameter as a hexadecimal string.
 * @throws {InvalidAbiDataToEncodeOrDecode}
 */
function encode<ValueType>(type: string | ParamType, value: ValueType): string {
    try {
        return ethersCoder.encode([type], [value]);
    } catch (e) {
        throw new InvalidAbiDataToEncodeOrDecode(
            'abi.encode()',
            'Encoding failed: Data must be a valid ABI type with corresponding valid data.',
            {
                type,
                value
            },
            e
        );
    }
}

/**
 * Encodes the given values according to the specified ABI types.
 *
 * @param types - An array of ABI types or an array of ParamType objects representing the types of the values to encode.
 * @param values - An array of values to be encoded according to the specified ABI types.
 * @returns The ABI-encoded string representing the given values.
 * @throws {InvalidAbiDataToEncodeOrDecode}
 *
 * @template ValueType - The type of the values being encoded.
 *
 * @example
 * ```typescript
 * const abiTypes = ['uint256', 'address'];
 * const values = [123, '0x1234567890123456789012345678901234567890'];
 * const encodedParams = encodeParams(abiTypes, values);
 * console.log(encodedParams);
 * ```
 */
function encodeParams(types: string[] | ParamType[], values: string[]): string {
    try {
        return ethersCoder.encode(types, values);
    } catch (e) {
        throw new InvalidAbiDataToEncodeOrDecode(
            'abi.encodeParams()',
            'Encoding failed: Data must be a valid ABI type with corresponding valid data.',
            {
                types,
                values
            },
            e
        );
    }
}

/**
 * Decodes a parameter value.
 *
 * @note `ReturnType` is used to explicitly specify the return type (the decoded value) of the function.
 *
 * @param types - Types of parameters.
 * @param data - Data to decode.
 * @returns Decoded parameter value.
 * @throws {InvalidAbiDataToEncodeOrDecode}
 */
function decode<ReturnType>(
    types: string | ParamType,
    data: BytesLike
): ReturnType {
    try {
        const decoded = ethersCoder.decode([types], data).toArray();
        return decoded[0] as ReturnType;
    } catch (e) {
        throw new InvalidAbiDataToEncodeOrDecode(
            'abi.decode()',
            'Decoding failed: Data must be a valid ABI type with corresponding valid data.',
            {
                types,
                data
            },
            e
        );
    }
}

/**
 * Object containing ABI representations.
 */
const abi = {
    ...fragment,
    encode,
    encodeParams,
    decode
};

export { abi };
