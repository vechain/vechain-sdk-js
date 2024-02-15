import {
    type BlockDetail,
    type ThorClient
} from '@vechain/vechain-sdk-network';
import {
    blocksFormatter,
    RPC_METHODS,
    RPCMethodsMap,
    type SyncBlockRPC
} from '../../../../provider';
import { JSONRPC, buildProviderError } from '@vechain/vechain-sdk-errors';
import { vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';

/**
 * Check if the block is out of sync in time.
 * A block is considered out of sync if the difference between the current time and the block timestamp is GREATER than 11 seconds.
 *
 * @param block - Block to check
 */
const _isBlockNotOutOfSyncInTime = (block: BlockDetail): boolean => {
    return Math.floor(Date.now() / 1000) - block.timestamp < 11000;
};

/**
 * RPC Method eth_syncing implementation
 *
 * @link [eth_syncing](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_syncing)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @note The startingBlock parameter is not supported.
 *
 * @returns Returns an object with the sync status of the node if the node is out-of-sync and is syncing. Returns false when the node is already in sync.
 */
const ethSyncing = async (
    thorClient: ThorClient
): Promise<boolean | SyncBlockRPC> => {
    try {
        // Get the best block and the genesis block
        const bestBlock = await thorClient.blocks.getBestBlock();
        const genesisBlock = await thorClient.blocks.getGenesisBlock();

        // Get the highest block number
        const highestBlockNumber: string | null =
            genesisBlock !== null
                ? vechain_sdk_core_ethers.toQuantity(
                      Math.floor((Date.now() - genesisBlock.timestamp) / 10000)
                  )
                : null;

        // Check the latest block
        if (bestBlock !== null) {
            // Check if the node is out of sync
            if (_isBlockNotOutOfSyncInTime(bestBlock)) return false;

            // Calculate the chainId
            const chainId = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_chainId
            ]([])) as string;

            return {
                currentBlock: blocksFormatter.formatToRPCStandard(
                    bestBlock,
                    chainId
                ),
                highestBlock: highestBlockNumber,

                // Not supported field
                startingBlock: null
            };
        }
        return {
            currentBlock: null,
            highestBlock: highestBlockNumber,

            // Not supported field
            startingBlock: null
        };
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_syncing' failed: Error while getting last syncing information\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethSyncing };
