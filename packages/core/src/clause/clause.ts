import { abi, coder, type FunctionFragment } from '../abi';
import { type TransactionClause } from '../transaction';
import type { DeployParams } from './types';
import { ERC721_ABI, VIP180_ABI } from '../utils';
import { assert, buildError, DATA } from '@vechain/sdk-errors';
import { addressUtils } from '../address';

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

    return {
        to: null,
        value: 0,
        data: contractBytecode + encodedParams
    };
}

/**
 * Builds a clause for interacting with a smart contract function.
 *
 * @param contractAddress - The address of the smart contract.
 * @param functionFragment - The function fragment to interact with.
 * @param args - The input data for the function.
 *
 * @param value - The amount of VET to send with the transaction.
 * @returns A clause for interacting with a smart contract function.
 *
 * @throws Will throw an error if an error occurs while encoding the function input.
 */
function functionInteraction(
    contractAddress: string,
    functionFragment: FunctionFragment,
    args: unknown[],
    value = 0
): TransactionClause {
    return {
        to: contractAddress,
        value,
        data: new abi.Function(functionFragment).encodeInput(args)
    };
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
        return functionInteraction(
            tokenAddress,
            coder
                .createInterface(VIP180_ABI)
                .getFunction('transfer') as FunctionFragment,
            [recipientAddress, BigInt(amount)]
        );
    } catch (error) {
        throw buildError(
            'transferToken',
            DATA.INVALID_DATA_TYPE,
            `Invalid 'amount' parameter. Expected an integer but received ${amount}.`
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
            'transferVET',
            bnAmount > 0,
            DATA.INVALID_DATA_TYPE,
            `Invalid 'amount' parameter. Expected a positive amount but received ${amount}.`
        );

        return {
            to: recipientAddress,
            value: `0x${BigInt(amount).toString(16)}`,
            data: '0x'
        };
    } catch (error) {
        throw buildError(
            'transferVET',
            DATA.INVALID_DATA_TYPE,
            `Invalid 'amount' parameter. Expected an integer but received ${amount}.`
        );
    }
}

/**
 * Transfers a specified NFT (Non-Fungible Token) from one address to another.
 *
 * This function prepares a transaction clause for transferring an NFT, based on the ERC721 standard,
 * by invoking a smart contract's 'transferFrom' method.
 *
 * @param {string} contractAddress - The address of the NFT contract.
 * @param {string} senderAddress - The address of the current owner (sender) of the NFT.
 * @param {string} recipientAddress - The address of the new owner (recipient) of the NFT.
 * @param {string} tokenId - The unique identifier of the NFT to be transferred.
 * @returns {TransactionClause} - An object representing the transaction clause required for the transfer.
 *
 * @throws {InvalidDataTypeError, InvalidAbiDataToEncodeError}.
 * */
function transferNFT(
    contractAddress: string,
    senderAddress: string,
    recipientAddress: string,
    tokenId: string
): TransactionClause {
    assert(
        'transferNFT',
        tokenId !== '',
        DATA.INVALID_DATA_TYPE,
        `Invalid 'tokenId' parameter. Expected an id but received ${tokenId}.`
    );

    assert(
        'transferNFT',
        addressUtils.isAddress(contractAddress),
        DATA.INVALID_DATA_TYPE,
        `Invalid 'contractAddress' parameter. Expected a contract address but received ${contractAddress}.`
    );

    return functionInteraction(
        contractAddress,
        coder
            .createInterface(ERC721_ABI)
            .getFunction('transferFrom') as FunctionFragment,
        [senderAddress, recipientAddress, tokenId]
    );
}

/**
 * clauseBuilder provides methods for building clauses for interacting with smart contracts or deploying smart contracts.
 */
export const clauseBuilder = {
    deployContract,
    functionInteraction,
    transferToken,
    transferVET,
    transferNFT
};
