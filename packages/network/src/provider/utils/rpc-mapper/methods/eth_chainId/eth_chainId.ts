import { Hex, HexUInt } from '@vechain/sdk-core';
import { type ThorClient } from '../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { chainTagToChainId } from '../../../const';

// In-memory cache
let cachedChainId: HexUInt | null = null;
let cachedChainTag: HexUInt | null = null;
let cachedGenesisBlockId: Hex | null = null;

/**
 * RPC Method eth_chainId implementation
 *
 * @link [eth_chainId](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - ThorClient instance.
 * @returns Returns the block id of the genesis block.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethChainId = async (thorClient: ThorClient): Promise<string> => {
    try {
        if (cachedChainId !== null) return cachedChainId.toString();
        const genesisBlock = await thorClient.blocks.getGenesisBlock();
        if (genesisBlock?.id === null || genesisBlock?.id === undefined) {
            throw new JSONRPCInvalidParams(
                'eth_chainId()',
                'The genesis block id is null or undefined. Unable to get the chain id.',
                {
                    url: thorClient.httpClient.baseURL
                }
            );
        }
        if (!Hex.isValid(genesisBlock.id)) {
            throw new JSONRPCInvalidParams(
                'eth_chainId()',
                'The genesis block id is invalid. Unable to get the chain id.',
                {
                    url: thorClient.httpClient.baseURL
                }
            );
        }
        cachedGenesisBlockId = Hex.of(genesisBlock.id);
        cachedChainTag = HexUInt.of(cachedGenesisBlockId.bytes.slice(-2));
        cachedChainId = chainTagToChainId(cachedChainTag);
        return cachedChainId.toString();
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_chainId()',
            'Method "eth_chainId" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

/*
 * Get the chain id from the cached value or fetch it from the network.
 *
 * @param thorClient - ThorClient instance.
 * @returns The chain id.
 */
const getCachedChainId = async (thorClient: ThorClient): Promise<string> => {
    return cachedChainId !== null
        ? cachedChainId.toString()
        : await ethChainId(thorClient);
};

/*
 * Get the chain tag from the cached value or fetch it from the network.
 *
 * @param thorClient - ThorClient instance.
 * @returns The chain tag.
 */
const getCachedChainTag = async (thorClient: ThorClient): Promise<string> => {
    return cachedChainTag !== null
        ? cachedChainTag.toString()
        : await ethChainId(thorClient);
};

export { ethChainId, getCachedChainId, getCachedChainTag };
