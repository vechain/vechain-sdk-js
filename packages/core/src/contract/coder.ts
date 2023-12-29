import { type InterfaceAbi, Interface as EthersInterface } from 'ethers';
import { ERROR_CODES, buildError } from '@vechainfoundation/vechain-sdk-errors';
import type { Interface, BytesLike, Result } from '../abi';
import { abi } from '../abi';

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
 * @throws {InvalidAbiDataToDecodeError}
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
            'Encoding failed: Function input must match ABI specifications and be correctly formatted',
            { functionName, functionData },
            e
        );
    }
}

/**
 * Decode the function data of an encoded function
 * @param interfaceABI ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param encodedFunctionInput The encoded function data.
 * @returns an array of the decoded function data
 * @throws {InvalidAbiDataToDecodeError}
 */
function decodeFunctionInput(
    interfaceABI: InterfaceAbi,
    functionName: string,
    encodedFunctionInput: BytesLike
): Result {
    try {
        const contractInterface = createInterface(interfaceABI);
        return new abi.Function(
            contractInterface.getFunction(functionName)
        ).decodeInput(encodedFunctionInput);
    } catch (e) {
        throw buildError(
            ERROR_CODES.ABI.INVALID_DATA_TO_DECODE,
            'Decoding failed: Function input must be properly encoded per ABI specifications',
            { functionName },
            e
        );
    }
}

/**
 * Decodes the output from a contract function using the specified ABI and function name.
 * It takes the encoded function output and attempts to decode it according to the ABI definition.
 *
 * @param {InterfaceAbi} interfaceABI - The ABI (Application Binary Interface) of the contract,
 *                                      which defines how data is structured in the blockchain.
 * @param {string} functionName - The name of the function in the contract to decode the output for.
 * @param encodedFunctionOutput - The encoded output data from the contract function.
 * @returns {Result} - The decoded output as a Result object, which provides a user-friendly way
 *                     to interact with the decoded data.
 *
 * @throws Will throw an error if decoding fails, typically due to incorrect encoding or mismatch
 *         with the ABI specifications. The error will provide details on the specific issue encountered.
 *
 * @example
 * // Example of decoding output for a function called "getValue":
 * const decodedOutput = decodeFunctionOutput(contractABI, 'getValue', encodedValue);
 *
 */
function decodeFunctionOutput(
    interfaceABI: InterfaceAbi,
    functionName: string,
    encodedFunctionOutput: BytesLike
): Result {
    try {
        const contractInterface = createInterface(interfaceABI);

        return new abi.Function(
            contractInterface.getFunction(functionName)
        ).decodeOutput(encodedFunctionOutput);
    } catch (e) {
        throw buildError(
            ERROR_CODES.ABI.INVALID_DATA_TO_DECODE,
            'Decoding failed: Function output must be properly encoded per ABI specifications',
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
            'Encoding failed: Event log data must align with ABI specifications for encoding',
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
            'Decoding failed: Event log data must be correctly encoded per ABI specifications',
            { eventName },
            e
        );
    }
}

export const coder = {
    createInterface,
    encodeFunctionInput,
    decodeFunctionInput,
    decodeFunctionOutput,
    encodeEventLog,
    decodeEventLog
};
