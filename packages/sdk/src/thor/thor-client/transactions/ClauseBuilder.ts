import { IllegalArgumentError } from '@common/errors';
import { Hex, type Address, type HexUInt } from '@common/vcdm';
import { ERC721_ABI, VIP180_ABI } from '@thor/utils';
import {
    encodeAbiParameters,
    encodeFunctionData,
    parseAbiParameters,
    type Abi,
    type AbiFunction
} from 'viem';
import type { DeployParams } from '../contracts';
import type { ClauseOptions } from '../contracts/model/ClauseOptions';
import { Clause } from '../model';
import {
    NO_DATA,
    ZERO_VALUE,
    TRANSFER_NFT_FUNCTION,
    TRANSFER_TOKEN_FUNCTION
} from '@thor/utils/const/constants';

const FQP = 'packages/sdk/src/thor/thor-client/transactions/ClauseBuilder.ts!';

/**
 * Optionally attach the ABI definition of the invoked function when requested.
 */
const withAbi = (
    abi: Abi,
    functionName: string,
    includeAbi?: boolean
): string | null => {
    if (includeAbi !== true) return null;

    const functionAbi = abi.find(
        (item: AbiFunction | { type?: string; name?: string }) =>
            item.type === 'function' && item.name === functionName
    ) as AbiFunction | undefined;

    return functionAbi !== undefined ? JSON.stringify(functionAbi) : null;
};

/**
 * Builds a clause that invokes a smart-contract function with the provided arguments.
 */
const getFunctionCallClause = (
    contractAddress: Address,
    contractAbi: Abi,
    functionName: string,
    args: readonly unknown[],
    value: bigint = ZERO_VALUE,
    metadata?: ClauseOptions
): Clause => {
    if (value < ZERO_VALUE) {
        throw new IllegalArgumentError(
            `${FQP}callFunction(contractAddress: Address, contractAbi: Abi, functionName: string, args: unknown[], value: bigint, metadata?: ClauseOptions)`,
            'negative value is not allowed',
            { value: `${value}` }
        );
    }

    return new Clause(
        contractAddress,
        value,
        Hex.of(
            encodeFunctionData({
                abi: contractAbi,
                functionName,
                args
            })
        ),
        metadata?.comment ?? null,
        withAbi(contractAbi, functionName, metadata?.includeAbi)
    );
};

// PEDNING
/**
 * Builds a clause that deploys bytecode with optional constructor parameters.
 */
const getDeployContractClause = (
    contractBytecode: HexUInt,
    deployParams?: DeployParams
): Clause => {
    let data = contractBytecode.digits;

    if (deployParams !== undefined) {
        const abiParams =
            typeof deployParams.types === 'string'
                ? parseAbiParameters(deployParams.types)
                : deployParams.types;

        const encodedParams = encodeAbiParameters(
            abiParams,
            deployParams.values
        );
        data += encodedParams.slice(2);
    }

    return new Clause(null, ZERO_VALUE, Hex.of(data), null);
};

/**
 * Builds a clause that transfers an NFT using the standard ERC-721 ABI.
 */
const getTransferNftClause = (
    contractAddress: Address,
    senderAddress: Address,
    recipientAddress: Address,
    tokenId: bigint,
    metadata?: ClauseOptions
): Clause =>
    getFunctionCallClause(
        contractAddress,
        ERC721_ABI,
        TRANSFER_NFT_FUNCTION,
        [senderAddress.toString(), recipientAddress.toString(), tokenId],
        ZERO_VALUE,
        metadata
    );

/**
 * Builds a clause that transfers VIP-180 tokens to a recipient.
 */
const getTransferTokenClause = (
    tokenAddress: Address,
    recipientAddress: Address,
    value: bigint,
    metadata?: ClauseOptions
): Clause => {
    if (value < ZERO_VALUE) {
        throw new IllegalArgumentError(
            `${FQP}transferToken(tokenAddress: Address, recipientAddress: Address, value: bigint, metadata?: ClauseOptions)`,
            'negative value is not allowed',
            { value: `${value}` }
        );
    }

    return getFunctionCallClause(
        tokenAddress,
        VIP180_ABI,
        TRANSFER_TOKEN_FUNCTION,
        [recipientAddress.toString(), value],
        ZERO_VALUE,
        metadata
    );
};

/**
 * Builds a clause that transfers native VET to a recipient.
 */
const getTransferVetClause = (
    recipientAddress: Address,
    value: bigint,
    metadata?: ClauseOptions
): Clause => {
    if (value < ZERO_VALUE) {
        throw new IllegalArgumentError(
            `${FQP}transferVET(recipientAddress: Address, value: bigint, metadata?: ClauseOptions)`,
            'negative value is not allowed',
            { value: `${value}` }
        );
    }

    return new Clause(
        recipientAddress,
        value,
        Hex.of(NO_DATA),
        metadata?.comment ?? null,
        null
    );
};

/**
 * Helper functions for constructing common transaction clauses.
 */
const ClauseBuilder = {
    callFunction: getFunctionCallClause,
    deployContract: getDeployContractClause,
    transferNFT: getTransferNftClause,
    transferToken: getTransferTokenClause,
    transferVET: getTransferVetClause,
    getFunctionCallClause,
    getDeployContractClause,
    getTransferNftClause,
    getTransferTokenClause,
    getTransferVetClause
} as const;

export { ClauseBuilder };
