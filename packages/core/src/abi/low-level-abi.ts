import { ethers } from 'ethers';
import { type ParamType, type BytesLike } from './types';

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
 */
function encode<ValueType>(type: string | ParamType, value: ValueType): string {
    const encoded = ethersCoder.encode([type], [value]);
    return encoded;
}

/**
 * Decodes a parameter value.
 *
 * @note `ReturnType` is used to explicitly specify the return type (the decoded value) of the function.
 *
 * @param types - Types of parameters.
 * @param data - Data to decode.
 * @returns Decoded parameter value.
 */
function decode<ReturnType>(
    types: string | ParamType,
    data: BytesLike
): ReturnType {
    const decoded = ethersCoder.decode([types], data).toArray();
    return decoded[0] as ReturnType;
}

// Low-level functionalities
const lowLevel = {
    encode,
    decode
};

export { lowLevel };
