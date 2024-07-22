import { Interface as EthersInterface, type InterfaceAbi } from 'ethers';
import { InvalidAbiDataToEncodeOrDecode } from '@vechain/sdk-errors';
import type { BytesLike, Interface, Log, Result } from '../abi';
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
 * @throws {InvalidAbiDataToEncodeOrDecode}
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
        throw new InvalidAbiDataToEncodeOrDecode(
            'coder.encodeFunctionInput()',
            `Encoding failed: Data format is invalid. Function data does not match the expected format for ABI type encoding.`,
            { interfaceABI, functionName, functionData },
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
 * @throws {InvalidAbiDataToEncodeOrDecode}
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
        throw new InvalidAbiDataToEncodeOrDecode(
            'coder.decodeFunctionInput()',
            'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
            { interfaceABI, functionName, encodedFunctionInput },
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
 * @throws {InvalidAbiDataToEncodeOrDecode}
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
        throw new InvalidAbiDataToEncodeOrDecode(
            'coder.decodeFunctionOutput()',
            `Decoding failed: Data must be a valid hex string encoding a compliant ABI type.`,
            { interfaceABI, functionName, encodedFunctionOutput },
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
 * @throws {InvalidAbiDataToEncodeOrDecode}
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
        throw new InvalidAbiDataToEncodeOrDecode(
            'coder.encodeEventLog()',
            `Encoding failed: Data format is invalid. Event data does not match the expected format for ABI type encoding.`,
            { interfaceABI, eventName, dataToEncode },
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
 * @throws {InvalidAbiDataToEncodeOrDecode}
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
        throw new InvalidAbiDataToEncodeOrDecode(
            'coder.decodeEventLog()',
            `Decoding failed: Data must be a valid hex string encoding a compliant ABI type.`,
            { interfaceABI, eventName, dataToDecode },
            e
        );
    }
}

/**
 * Decodes an Ethereum log based on the ABI definition.
 *
 * This method takes raw `data` and `topics` from an Ethereum log and attempts
 * to decode them using the contract's ABI definition. If the decoding is successful,
 * it returns a `Log` object representing the decoded information. If the decoding fails,
 * it throws a custom error with detailed information.
 *
 * @param interfaceABI - The ABI (Application Binary Interface) of the contract.
 * @param {string} data - The hexadecimal string of the data field in the log.
 * @param {string[]} topics - An array of hexadecimal strings representing the topics of the log.
 * @returns {Log | null} - A `Log` object representing the decoded log or null if decoding fails.
 * @throws {InvalidAbiDataToEncodeOrDecode}
 */
function parseLog(
    interfaceABI: InterfaceAbi,
    data: string,
    topics: string[]
): Log | null {
    try {
        const contractInterface = createInterface(interfaceABI);
        return contractInterface.parseLog({ topics, data });
    } catch (e) {
        throw new InvalidAbiDataToEncodeOrDecode(
            'coder.parseLog()',
            `Decoding failed: Data must be a valid hex string encoding a compliant ABI type.`,
            { interfaceABI, data, topics },
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
    decodeEventLog,
    parseLog
};
