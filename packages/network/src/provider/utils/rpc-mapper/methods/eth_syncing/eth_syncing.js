"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethSyncing = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const formatter_1 = require("../../../formatter");
const eth_chainId_1 = require("../eth_chainId");
/**
 * Check if the block is out of sync in time.
 * A block is considered out of sync if the difference between the current time and the block timestamp is GREATER than 11 seconds.
 *
 * @param block - Block to check
 */
const _isBlockNotOutOfSyncInTime = (block) => {
    return Math.floor(Date.now() / 1000) - block.timestamp < 11000;
};
/**
 * RPC Method eth_syncing implementation
 *
 * @link [eth_syncing](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @note The startingBlock parameter is not supported.
 *
 * @returns Returns an object with the sync status of the node if the node is out-of-sync and is syncing. Returns false when the node is already in sync.
 */
const ethSyncing = async (thorClient) => {
    try {
        // Get the best block and the genesis block
        const bestBlock = await thorClient.blocks.getBestBlockCompressed();
        const genesisBlock = await thorClient.blocks.getGenesisBlock();
        // Get the highest block number
        const highestBlockNumber = genesisBlock !== null
            ? sdk_core_1.HexInt.of(Math.floor((Date.now() - genesisBlock.timestamp) / 10000)).toString()
            : null;
        // Check the latest block
        if (bestBlock !== null) {
            // Check if the node is out of sync
            if (_isBlockNotOutOfSyncInTime(bestBlock))
                return false;
            // Calculate the chainId
            const chainId = await (0, eth_chainId_1.ethChainId)(thorClient);
            return {
                currentBlock: formatter_1.blocksFormatter.formatToRPCStandard(bestBlock, chainId),
                highestBlock: highestBlockNumber,
                // Not supported field
                startingBlock: null
            };
        }
        // Strange cases when the fetched best block is null
        return {
            currentBlock: null,
            highestBlock: highestBlockNumber,
            // Not supported field
            startingBlock: null
        };
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_syncing()', 'Method "eth_syncing" failed.', {
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethSyncing = ethSyncing;
