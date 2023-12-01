import { type BytesLike, type ParamType } from './types';
import { ethers } from 'ethers';
import { fragment } from './fragment';
import { ABI, buildError } from '@vechainfoundation/vechain-sdk-errors';

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
            ABI.INVALID_DATA_TO_DECODE,
            'Decoding failed: Data must be a valid hex string that encodes a valid ABI type'
        );
    }
}

/**
 * Object containing ABI representations.
 */
const abi = {
    ...fragment,
    encode,
    decode
};

export { abi };
