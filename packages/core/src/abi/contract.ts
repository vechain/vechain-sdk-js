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
 * @param abi ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param functionData The data to pass to the function.
 * @returns The encoded data that can be used to send a transaction.
 * @throws {ContractInterfaceError}
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
            ERROR_CODES.ABI.CONTRACT_INTERFACE_ERROR,
            'Encoding failed: Function input must match ABI specifications and be correctly formatted',
            { functionName, functionData },
            e
        );
    }
}

/**
 * Decode the function data of an encoded function
 * @param abi ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param encodedFunction The encoded function data.
 * @returns an array of the decoded function data
 * @throws {ContractInterfaceError}
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
            ERROR_CODES.ABI.CONTRACT_INTERFACE_ERROR,
            'Decoding failed: Function input must be properly encoded per ABI specifications',
            { functionName },
            e
        );
    }
}

/**
 * Encode event log data.
 * @param abi ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param functionData The data to pass to the function.
 * @returns The encoded data that can be used to send a transaction.
 * @throws {ContractInterfaceError}
 */
function encodeEventLog(
    interfaceABI: InterfaceAbi,
    eventName: string,
    dataToEncode: unknown[]
): { data: string; topics: string[] } {
    try {
        const contractInterface = createInterface(interfaceABI);
        return new abi.Event(
            contractInterface.getEvent(eventName)
        ).encodeEventLog(dataToEncode);
    } catch (e) {
        throw buildError(
            ERROR_CODES.ABI.CONTRACT_INTERFACE_ERROR,
            'Encoding failed: Event log data must align with ABI specifications for encoding',
            { eventName },
            e
        );
    }
}

/**
 * Decode event log data
 * @param abi ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param encodedFunction The encoded function data.
 * @returns an array of the decoded function data
 * @throws {ContractInterfaceError}
 */
function decodeEventLog(
    interfaceABI: InterfaceAbi,
    eventName: string,
    dataToDecode: { data: string; topics: string[] }
): Result {
    try {
        const contractInterface = createInterface(interfaceABI);
        return new abi.Event(
            contractInterface.getEvent(eventName)
        ).decodeEventLog(dataToDecode);
    } catch (e) {
        throw buildError(
            ERROR_CODES.ABI.CONTRACT_INTERFACE_ERROR,
            'Decoding failed: Event log data must be correctly encoded per ABI specifications',
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
