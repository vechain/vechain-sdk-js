import { type BytesLike, type ParamType } from './types';
import { ethers } from 'ethers';
import { fragment } from './fragment';
import { ABI, buildError } from '@vechain/sdk-errors';

/**
 * Default AbiCoder instance from ethers.js.
 */
const ethersCoder = new ethers.AbiCoder();

/**
 * Encodes a parameter value.
 *
 * @note `ValueType` is used to explicitly specify the type of the value to encode.
 *
 * @throws{InvalidAbiDataToEncodeError}
 * @param type - Type of the parameter.
 * @param value - Value to encode.
 * @returns Encoded parameter as a hexadecimal string.
 */
function encode<ValueType>(type: string | ParamType, value: ValueType): string {
    try {
        return ethersCoder.encode([type], [value]);
    } catch {
        throw buildError(
            'encode',
            ABI.INVALID_DATA_TO_ENCODE,
            'Encoding failed: Data must be a valid ABI type with corresponding valid data.'
        );
    }
}

/**
 * Encodes the given values according to the specified ABI types.
 *
 * @param types - An array of ABI types or an array of ParamType objects representing the types of the values to encode.
 * @param values - An array of values to be encoded according to the specified ABI types.
 * @returns The ABI-encoded string representing the given values.
 * @throws Throws an error if encoding fails. The error message indicates that the data must be a valid ABI type with corresponding valid data.
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
    } catch {
        throw buildError(
            'encodeParams',
            ABI.INVALID_DATA_TO_ENCODE,
            'Encoding failed: Data must be a valid ABI type with corresponding valid data.'
        );
    }
}

/**
 * Decodes a parameter value.
 *
 * @note `ReturnType` is used to explicitly specify the return type (the decoded value) of the function.
 *
 * @throws{InvalidAbiDataToDecodeError}
 * @param types - Types of parameters.
 * @param data - Data to decode.
 * @returns Decoded parameter value.
 */
function decode<ReturnType>(
    types: string | ParamType,
    data: BytesLike
): ReturnType {
    try {
        const decoded = ethersCoder.decode([types], data).toArray();
        return decoded[0] as ReturnType;
    } catch {
        throw buildError(
            'decode',
            ABI.INVALID_DATA_TO_DECODE,
            'Decoding failed: Data must be a valid hex string that encodes a valid ABI type.'
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
