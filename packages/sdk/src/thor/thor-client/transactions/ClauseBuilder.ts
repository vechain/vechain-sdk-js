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
import {
    type DeployParams,
    type TransactionClause
} from '@thor/thorest/transactions/model';

interface ClauseMetadata {
    comment?: string;
    includeAbi?: boolean;
}

const FQP = 'packages/sdk/src/thor/thor-client/transactions/ClauseBuilder.ts!';

const NO_DATA = Hex.PREFIX;

const ZERO_VALUE = 0n;

const TRANSFER_NFT_FUNCTION = 'transferFrom';

const TRANSFER_TOKEN_FUNCTION = 'transfer';

const toLowercaseAddress = (address: Address | null): string | null =>
    address === null ? null : address.toString().toLowerCase();

const withAbi = (
    abi: Abi,
    functionName: string,
    includeAbi?: boolean
): string | undefined => {
    if (includeAbi !== true) return undefined;

    const functionAbi = abi.find(
        (item: AbiFunction | { type?: string; name?: string }) =>
            item.type === 'function' && item.name === functionName
    ) as AbiFunction | undefined;

    return functionAbi !== undefined ? JSON.stringify(functionAbi) : undefined;
};

const callFunction = (
    contractAddress: Address,
    contractAbi: Abi,
    functionName: string,
    args: readonly unknown[],
    value: bigint = ZERO_VALUE,
    metadata?: ClauseMetadata
): TransactionClause => {
    if (value < ZERO_VALUE) {
        throw new IllegalArgumentError(
            `${FQP}callFunction(contractAddress: Address, contractAbi: Abi, functionName: string, args: unknown[], value: bigint, metadata?: ClauseMetadata)`,
            'negative value is not allowed',
            { value: `${value}` }
        );
    }

    return {
        to: toLowercaseAddress(contractAddress),
        value,
        data: encodeFunctionData({
            abi: contractAbi,
            functionName,
            args
        }),
        comment: metadata?.comment,
        abi: withAbi(contractAbi, functionName, metadata?.includeAbi)
    } satisfies TransactionClause;
};

const deployContract = (
    contractBytecode: HexUInt,
    deployParams?: DeployParams,
    metadata?: ClauseMetadata
): TransactionClause => {
    let data = contractBytecode.digits;

    if (deployParams !== undefined && deployParams !== null) {
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

    return {
        to: null,
        value: ZERO_VALUE,
        data: Hex.PREFIX + data,
        comment: metadata?.comment
    } satisfies TransactionClause;
};

const transferNFT = (
    contractAddress: Address,
    senderAddress: Address,
    recipientAddress: Address,
    tokenId: bigint,
    metadata?: ClauseMetadata
): TransactionClause =>
    callFunction(
        contractAddress,
        ERC721_ABI,
        TRANSFER_NFT_FUNCTION,
        [senderAddress.toString(), recipientAddress.toString(), tokenId],
        ZERO_VALUE,
        metadata
    );

const transferToken = (
    tokenAddress: Address,
    recipientAddress: Address,
    value: bigint,
    metadata?: ClauseMetadata
): TransactionClause => {
    if (value < ZERO_VALUE) {
        throw new IllegalArgumentError(
            `${FQP}transferToken(tokenAddress: Address, recipientAddress: Address, value: bigint, metadata?: ClauseMetadata)`,
            'negative value is not allowed',
            { value: `${value}` }
        );
    }

    return callFunction(
        tokenAddress,
        VIP180_ABI,
        TRANSFER_TOKEN_FUNCTION,
        [recipientAddress.toString(), value],
        ZERO_VALUE,
        metadata
    );
};

const transferVET = (
    recipientAddress: Address,
    value: bigint,
    metadata?: ClauseMetadata
): TransactionClause => {
    if (value < ZERO_VALUE) {
        throw new IllegalArgumentError(
            `${FQP}transferVET(recipientAddress: Address, value: bigint, metadata?: ClauseMetadata)`,
            'negative value is not allowed',
            { value: `${value}` }
        );
    }

    return {
        to: toLowercaseAddress(recipientAddress),
        value,
        data: NO_DATA,
        comment: metadata?.comment
    } satisfies TransactionClause;
};

const ClauseBuilder = {
    callFunction,
    deployContract,
    transferNFT,
    transferToken,
    transferVET
} as const;

export { ClauseBuilder };
