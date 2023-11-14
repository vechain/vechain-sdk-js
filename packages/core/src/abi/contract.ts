import { type InterfaceAbi, Interface as EthersInterface } from 'ethers';
import type { BytesLike, Interface, Result } from './types';
import { abi } from './coder';
import { ERROR_CODES, buildError } from '@vechain-sdk/errors';

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
            'Cannot encode the input of the function',
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
            'Cannot decode the input of the function',
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
            'Cannot encode the input of the event log',
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
            'Cannot decode the input of the event log',
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
