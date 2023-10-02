import { type InterfaceAbi, ethers } from 'ethers';
import { type AbiInput } from './types';
import * as web3 from 'web3';

/**
 * Convert JSON ABI format to human readable format
 *
 * @param abi Abi to convert
 * @param minimal Minimal format
 * @returns Converted abi
 */
function jsonToHumanReadable(abi: InterfaceAbi, minimal: boolean): string[] {
    const abiInterface = new ethers.Interface(abi);
    return abiInterface.format(minimal);
}

/**
 * Encode parameter
 *
 * @ote ParameterType is used to make explicit the type of the parameter (the value to encode).
 *
 * @param types Types of parameters
 * @param values Values of parameters
 * @returns Encoded parameters
 */
function encodeParameter<ParameterType>(
    type: AbiInput,
    value: ParameterType
): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return web3.eth.abi.encodeParameter(type, value);
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
function decodeParameter<ReturnType>(
    types: AbiInput,
    data: string
): ReturnType {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return web3.eth.abi.decodeParameter(types, data) as ReturnType;
}

/**
 * Encode parameter
 *
 * @ote ParameterType is used to make explicit the type of the parameter (the value to encode).
 *
 * @param types Types of parameters
 * @param values Values of parameters
 * @returns Encoded parameters
 */
function encodeParameters<ParameterType>(
    type: AbiInput[],
    value: ParameterType[]
): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return web3.eth.abi.encodeParameters(type, value);
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
function decodeParameters<ReturnType>(
    types: AbiInput[],
    data: string
): Record<string, ReturnType> & { __length__: number } {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return web3.eth.abi.decodeParameters(types, data) as Record<
        string,
        ReturnType
    > & { __length__: number };
}

// Low level functionalities
const lowLevel = {
    encodeParameter,
    decodeParameter,
    encodeParameters,
    decodeParameters,
    jsonToHumanReadable
};
const abi = {
    lowLevel
};
export { abi };
