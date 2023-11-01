import { type InterfaceAbi, Interface as EthersInterface } from 'ethers';
import type { Interface, Result } from './types';

/**
 * Creates a new Interface instance from an ABI fragment.
 * @param abi - ABI in a compatible format
 * @returns The Interface instance.
 * @throws Will throw an error if the ABI is invalid.
 */
function createInterface(abi: InterfaceAbi): Interface {
    try {
        return new EthersInterface(abi);
    } catch {
        throw new Error('Invalid ABI');
    }
}

/**
 * Encode function data that can be used to send a transaction.
 * @param abi ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param functionData The data to pass to the function.
 * @returns The encoded data that can be used to send a transaction.
 */
function encodeFunctionData(
    abi: InterfaceAbi,
    functionName: string,
    functionData?: unknown[]
): string {
    try {
        const contractInterface = createInterface(abi);
        return contractInterface.encodeFunctionData(functionName, functionData);
    } catch {
        throw new Error('Invalid data to encode');
    }
}

/**
 * Decode the function data of an encoded function
 * @param abi ABI in a compatible format
 * @param functionName The name of the function defined in the ABI.
 * @param encodedFunction The encoded function data.
 * @returns an array of the decoded function data
 */
function decodeFunctionData(
    abi: InterfaceAbi,
    functionName: string,
    encodedFunction: string
): Result {
    try {
        const contractInterface = createInterface(abi);
        return contractInterface.decodeFunctionData(
            functionName,
            encodedFunction
        );
    } catch {
        throw new Error('Invalid data to decode');
    }
}

const contract = {
    createInterface,
    encodeFunctionData,
    decodeFunctionData
};

export { contract };
