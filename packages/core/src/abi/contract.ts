import { type InterfaceAbi, Interface as EthersInterface } from 'ethers';
import type { BytesLike, Interface, Result } from './types';
import { abi } from './coder';
import { ERROR_CODES, buildError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Creates a new Interface instance from an ABI fragment.
 * @param abi - ABI in a compatible format
 * @returns The Interface instance.
 */
function createInterface(abi: InterfaceAbi): Interface {
    return new EthersInterface(abi);
}

/**
 * Encode function data that can be used to send a transaction.
 * @param interfaceABI ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param functionData The data to pass to the function.
 * @returns The encoded data that can be used to send a transaction.
 * @throws {InvalidAbiDataToEncodeError}
 */
function encodeFunctionInput(
    interfaceABI: InterfaceAbi,
    functionName: string,
    functionData?: unknown[]
): string {
    try {
        const contractInterface = createInterface(interfaceABI);
        return new abi.Function(
            contractInterface.getFunction(functionName)
        ).encodeInput(functionData);
    } catch (e) {
        throw buildError(
            ERROR_CODES.ABI.INVALID_DATA_TO_ENCODE,
            'Cannot encode the input of the function',
            { functionName, functionData },
            e
        );
    }
}

/**
 * Decode the function data of an encoded function
 * @param interfaceABI ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param encodedFunction The encoded function data.
 * @returns an array of the decoded function data
 * @throws {InvalidAbiDataToDecodeError}
 */
function decodeFunctionInput(
    interfaceABI: InterfaceAbi,
    functionName: string,
    encodedFunction: BytesLike
): Result {
    try {
        const contractInterface = createInterface(interfaceABI);
        return new abi.Function(
            contractInterface.getFunction(functionName)
        ).decodeInput(encodedFunction);
    } catch (e) {
        throw buildError(
            ERROR_CODES.ABI.INVALID_DATA_TO_DECODE,
            'Cannot decode the input of the function',
            { functionName },
            e
        );
    }
}
/**
 * Encodes event log data based on the provided contract interface ABI, event name, and data to encode.
 * @param interfaceABI - The ABI (Application Binary Interface) of the contract.
 * @param eventName - The name of the event to be encoded.
 * @param dataToEncode - An array of data to be encoded in the event log.
 * @returns An object containing the encoded data and topics.
 * @throws {InvalidAbiEventError} Throws an error if encoding fails, including relevant details.
 */
function encodeEventLog(
    interfaceABI: InterfaceAbi,
    eventName: string,
    dataToEncode: unknown[]
): { data: string; topics: string[] } {
    try {
        // Create a contract interface using the provided ABI
        const contractInterface = createInterface(interfaceABI);

        // Encode the event log data using the contract interface and event name
        return new abi.Event(
            contractInterface.getEvent(eventName)
        ).encodeEventLog(dataToEncode);
    } catch (e) {
        // Handle errors and throw a custom error with relevant details
        throw buildError(
            ERROR_CODES.ABI.INVALID_EVENT,
            'Cannot encode event log data',
            { eventName },
            e
        );
    }
}

/**
 * Decodes event log data based on the provided contract interface ABI, event name, and data/topics to decode.
 * @param interfaceABI - The ABI (Application Binary Interface) of the contract.
 * @param eventName - The name of the event to be decoded.
 * @param dataToDecode - An object containing the data and topics to be decoded.
 * @returns The decoded data of the event log.
 * @throws {InvalidAbiEventError} Throws an error if decoding fails, including relevant details.
 */
function decodeEventLog(
    interfaceABI: InterfaceAbi,
    eventName: string,
    dataToDecode: { data: string; topics: string[] }
): Result {
    try {
        // Create a contract interface using the provided ABI
        const contractInterface = createInterface(interfaceABI);

        // Decode the event log data using the contract interface, event name, and raw data/topics
        return new abi.Event(
            contractInterface.getEvent(eventName)
        ).decodeEventLog(dataToDecode);
    } catch (e) {
        // Handle errors and throw a custom error with relevant details
        throw buildError(
            ERROR_CODES.ABI.INVALID_EVENT,
            'Cannot decode event log data',
            { eventName },
            e
        );
    }
}

export const contract = {
    createInterface,
    encodeFunctionInput,
    decodeFunctionInput,
    encodeEventLog,
    decodeEventLog
};
