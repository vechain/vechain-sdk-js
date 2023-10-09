import { ethers } from 'ethers';
import { type ParamType } from './types';

/**
 * Default coder
 */
const ethersCoder = new ethers.AbiCoder();

/**
 * Encode parameter
 *
 * @note ValueType is used to make explicit the type of the value to encode.
 *
 * @param types Types of parameters
 * @param values Values of parameters
 * @returns Encoded parameters
 */
function encode<ValueType>(type: string | ParamType, value: ValueType): string {
    const encoded = ethersCoder.encode([type], [value]);
    return encoded;
}

/**
 * Decode parameter
 *
 * @note ReturnType is used to make explicit the return type of the function (the decoded value).
 *
 * @param types Types of parameters
 * @param data Data to decode
 * @returns Decoded parameters
 */
function decode<ReturnType>(
    types: string | ParamType,
    data: ethers.BytesLike
): ReturnType {
    const decoded = ethersCoder.decode([types], data).toArray();
    return decoded[0] as ReturnType;
}

// Low level functionalities
const lowLevel = {
    encode,
    decode
};
export { lowLevel };
