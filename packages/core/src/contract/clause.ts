import { type InterfaceAbi } from 'ethers';
import { abi, coder } from '../abi';
import { type TransactionClause } from '../transaction';
import type { DeployParams } from './types';

/**
 * Builds a clause for deploying a smart contract.
 *
 * @param contractBytecode - The bytecode of the smart contract to be deployed.
 * @param deployParams - The parameters to pass to the smart contract constructor.
 *
 * @returns A clause for deploying a smart contract.
 */
function deployContract(
    contractBytecode: string,
    deployParams?: DeployParams
): TransactionClause {
    let encodedParams = '';
    if (deployParams != null) {
        encodedParams = abi
            .encodeParams(deployParams.types, deployParams.values)
            .replace('0x', '');
    }

    const clause: TransactionClause = {
        to: null,
        value: 0,
        data: contractBytecode + encodedParams
    };

    return clause;
}

/**
 * Builds a clause for interacting with a smart contract function.
 *
 * @param contractAddress - The address of the smart contract.
 * @param contractAbi - The ABI (Application Binary Interface) of the smart contract.
 * @param functionName - The name of the function to be called.
 * @param args - The input data for the function.
 *
 * @returns A clause for interacting with a smart contract function.
 *
 * @throws Will throw an error if an error occurs while encoding the function input.
 */
function functionInteraction(
    contractAddress: string,
    contractAbi: InterfaceAbi,
    functionName: string,
    args: unknown[]
): TransactionClause {
    const clause: TransactionClause = {
        to: contractAddress,
        value: 0,
        data: coder.encodeFunctionInput(contractAbi, functionName, args)
    };

    return clause;
}

/**
 * clauseBuilder provides methods for building clauses for interacting with smart contracts or deploying smart contracts.
 */
export const clauseBuilder = {
    deployContract,
    functionInteraction
};
