import { type ThorClient } from '@vechain/vechain-sdk-network';
import {
    blocksFormatter,
    RPC_METHODS,
    RPCMethodsMap,
    type SyncBlockRPC
} from '../../../../provider';
import { JSONRPC, buildProviderError } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_syncing implementation
 *
 * @link [eth_syncing](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_syncing)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @returns Returns an object with the sync status of the node if the node is out-of-sync and is syncing. Returns false when the node is already in sync.
 */
const ethSyncing = async (
    thorClient: ThorClient
): Promise<boolean | SyncBlockRPC> => {
    try {
        const bestBlock = await thorClient.blocks.getBestBlock();
        const genesisBlock = await thorClient.blocks.getGenesisBlock();

        // Check if the node is already in sync
        if (
            bestBlock != null &&
            Math.floor(Date.now() / 1000) - bestBlock.timestamp < 11000
        ) {
            return false;
        }

        // Calculate the chainId
        const chainId = (await RPCMethodsMap(thorClient)[
            RPC_METHODS.eth_chainId
        ]([])) as string;

        const highestBlock =
            genesisBlock != null
                ? Math.floor((Date.now() - genesisBlock.timestamp) / 10000)
                : null;

        return {
            startingBlock: null,
            currentBlock:
                bestBlock != null
                    ? blocksFormatter.formatToRPCStandard(bestBlock, chainId)
                    : null,
            highestBlock:
                highestBlock != null ? highestBlock.toString(16) : null
        };
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_syncing' failed: Error while getting last block\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethSyncing };
