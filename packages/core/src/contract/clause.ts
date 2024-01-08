import { type InterfaceAbi } from 'ethers';
import { abi, coder } from '../abi';
import { type TransactionClause } from '../transaction';
import type { DeployParams } from './types';
import { VIP180 } from '../utils';
import {
    DATA,
    assert,
    buildError
} from '@vechainfoundation/vechain-sdk-errors';

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
 * Builds a clause for transferring VIP180 tokens.
 *
 * @param tokenAddress - The address of the VIP180 token.
 * @param recipientAddress - The address of the recipient.
 * @param amount - The amount of tokens to transfer in the decimals of the token.
 *                 For instance, a token with 18 decimals, 1 token would be 1000000000000000000 (i.e., 10 ** 18).
 *
 * @returns A clause for transferring VIP180 tokens.
 *
 * @throws Will throw an error if the amount is not an integer or if the encoding of the function input fails.
 */
function transferToken(
    tokenAddress: string,
    recipientAddress: string,
    amount: number | bigint | string
): TransactionClause {
    try {
        return functionInteraction(tokenAddress, VIP180, 'transfer', [
            recipientAddress,
            BigInt(amount)
        ]);
    } catch (error) {
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            `Invalid 'amount' parameter. Expected an integer but received ${amount}`
        );
    }
}

/**
 * Builds a clause for transferring VET.
 *
 * @param recipientAddress - The address of the recipient.
 * @param amount - The amount of VET to transfer in wei.
 * @returns A clause for transferring VET.
 *
 * @throws Will throw an error if the amount is not an integer.
 */
function transferVET(
    recipientAddress: string,
    amount: number | bigint | string
): TransactionClause {
    try {
        const bnAmount = BigInt(amount);

        // The amount must be positive otherwise we would be transferring negative VET.
        assert(
            bnAmount > 0,
            DATA.INVALID_DATA_TYPE,
            `Invalid 'amount' parameter. Expected a positive amount but received ${amount}`
        );

        return {
            to: recipientAddress,
            value: `0x${BigInt(amount).toString(16)}`,
            data: '0x'
        };
    } catch (error) {
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            `Invalid 'amount' parameter. Expected an integer but received ${amount}`
        );
    }
}
/**
 * clauseBuilder provides methods for building clauses for interacting with smart contracts or deploying smart contracts.
 */
export const clauseBuilder = {
    deployContract,
    functionInteraction,
    transferToken,
    transferVET
};
