import { InvalidDataType } from '@vechain/sdk-errors';
import { type ClauseOptions, type TransactionClause } from '../transaction';
import { ERC721_ABI, VIP180_ABI } from '../utils';
import { ABIContract, Address, abi } from '../vcdm';
import { type ABIFunction } from '../vcdm/abi/ABIFunction';
import type { DeployParams } from './DeployParams';

/**
 * Builds a clause for deploying a smart contract.
 *
 * @param contractBytecode - The bytecode of the smart contract to be deployed.
 * @param deployParams - The parameters to pass to the smart contract constructor.
 *
 * @param clauseOptions - Optional settings for the clause.
 * @returns A clause for deploying a smart contract.
 */
function deployContract(
    contractBytecode: string,
    deployParams?: DeployParams,
    clauseOptions?: ClauseOptions
): TransactionClause {
    let encodedParams = '';
    if (deployParams != null) {
        encodedParams = abi
            .encodeParams(deployParams.types, deployParams.values)
            .replace('0x', '');
    }

    const transactionClause: TransactionClause = {
        to: null,
        value: 0,
        data: contractBytecode + encodedParams
    };

    if (clauseOptions?.comment !== undefined) {
        return {
            ...transactionClause,
            comment: clauseOptions.comment
        } satisfies TransactionClause;
    } else {
        return transactionClause;
    }
}

/**
 * Builds a clause for interacting with a smart contract function.
 *
 * @param contractAddress - The address of the smart contract.
 * @param functionAbi - The function ABI to interact with.
 * @param args - The input data for the function.
 *
 * @param value - The amount of VET to send with the transaction.
 * @param clauseOptions - Optional settings for the clause.
 * @returns A clause for interacting with a smart contract function.
 *
 * @throws Will throw an error if an error occurs while encoding the function input.
 */
function functionInteraction(
    contractAddress: string,
    functionAbi: ABIFunction,
    args: unknown[],
    value = 0,
    clauseOptions?: ClauseOptions
): TransactionClause {
    const transactionClause: TransactionClause = {
        to: contractAddress,
        value,
        data: functionAbi.encodeData(args).toString()
    };

    if (clauseOptions !== undefined) {
        return {
            ...transactionClause,
            comment: clauseOptions.comment,
            abi:
                clauseOptions.includeABI === true
                    ? functionAbi.format('json')
                    : undefined
        } satisfies TransactionClause;
    } else {
        return transactionClause;
    }
}

/**
 * Builds a clause for transferring VIP180 tokens.
 *
 * @param tokenAddress - The address of the VIP180 token.
 * @param recipientAddress - The address of the recipient.
 * @param amount - The amount of tokens to transfer in the decimals of the token.
 *                 For instance, a token with 18 decimals, 1 token would be 1000000000000000000 (i.e., 10 ** 18).
 *
 * @param clauseOptions - Optional settings for the clause.
 * @returns A clause for transferring VIP180 tokens.
 * @throws {InvalidDataType}
 */
function transferToken(
    tokenAddress: string,
    recipientAddress: string,
    amount: number | bigint | string,
    clauseOptions?: ClauseOptions
): TransactionClause {
    try {
        return functionInteraction(
            tokenAddress,
            ABIContract.ofAbi(VIP180_ABI).getFunction('transfer'),
            [recipientAddress, BigInt(amount)],
            undefined,
            clauseOptions
        );
    } catch (error) {
        throw new InvalidDataType(
            'transferToken()',
            `Invalid 'amount' parameter. Expected an integer but received ${amount}.`,
            { amount },
            error
        );
    }
}

/**
 * Builds a clause for transferring VET.
 *
 * @param recipientAddress - The address of the recipient.
 * @param amount - The amount of VET to transfer in wei.
 * @param clauseOptions - Optional settings for the clause.
 * @returns A clause for transferring VET.
 * @throws {InvalidDataType}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function transferVET(
    recipientAddress: string,
    amount: number | bigint | string,
    clauseOptions?: ClauseOptions
): TransactionClause {
    try {
        const bnAmount = BigInt(amount);

        // The amount must be positive otherwise we would be transferring negative VET.
        if (bnAmount < 0) {
            throw new InvalidDataType(
                'transferVET()',
                `Invalid 'amount' parameter. Expected a positive amount but received ${amount}.`,
                { amount }
            );
        }

        const transactionClause: TransactionClause = {
            to: recipientAddress,
            value: `0x${BigInt(amount).toString(16)}`,
            data: '0x'
        };

        if (clauseOptions?.comment !== undefined) {
            return {
                ...transactionClause,
                comment: clauseOptions.comment
            } satisfies TransactionClause;
        } else {
            return transactionClause;
        }
    } catch (error) {
        throw new InvalidDataType(
            'transferVET()',
            `Invalid 'amount' parameter. Expected an integer but received ${amount}.`,
            { amount },
            error
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
 * @param clauseOptions - Optional settings for the clause.
 * @returns {TransactionClause} - An object representing the transaction clause required for the transfer.
 * @throws {InvalidDataType}
 * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function transferNFT(
    contractAddress: string,
    senderAddress: string,
    recipientAddress: string,
    tokenId: string,
    clauseOptions?: ClauseOptions
): TransactionClause {
    if (tokenId === '') {
        throw new InvalidDataType(
            'transferNFT()',
            `Invalid 'tokenId' parameter. Expected an id but received ${tokenId}.`,
            { tokenId }
        );
    }

    if (!Address.isValid(senderAddress)) {
        throw new InvalidDataType(
            'transferNFT()',
            `Invalid 'senderAddress' parameter. Expected a contract address but received ${senderAddress}.`,
            { senderAddress }
        );
    }

    if (!Address.isValid(contractAddress)) {
        throw new InvalidDataType(
            'transferNFT()',
            `Invalid 'senderAddress' parameter. Expected a contract address but received ${contractAddress}.`,
            { contractAddress }
        );
    }

    const functionAbi =
        ABIContract.ofAbi(ERC721_ABI).getFunction('transferFrom');

    return functionInteraction(
        contractAddress,
        functionAbi,
        [senderAddress, recipientAddress, tokenId],
        undefined,
        clauseOptions
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
