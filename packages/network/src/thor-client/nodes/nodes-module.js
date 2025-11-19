"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodesModule = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../utils");
const http_1 = require("../../http");
const chainTagCache = new WeakMap();
/**
 * The `NodesModule` class serves as a module for node-related functionality, for example, checking the health of a node.
 */
class NodesModule {
    blocksModule;
    constructor(blocksModule) {
        this.blocksModule = blocksModule;
    }
    /**
     * Retrieves connected peers of a node.
     *
     * @returns A promise that resolves to the list of connected peers.
     */
    async getNodes() {
        const nodes = (await this.blocksModule.httpClient.http(http_1.HttpMethod.GET, utils_1.thorest.nodes.get.NODES()));
        return nodes ?? [];
    }
    /**
     * Checks the health of a node using the following algorithm:
     * 1. Make an HTTP GET request to retrieve the last block timestamp.
     * 2. Calculates the difference between the current time and the last block timestamp.
     * 3. If the difference is less than the tolerance, the node is healthy.
     * Note, we could also check '/node/network/peers since' but the difficulty with this approach is
     * if you consider a scenario where the node is connected to 20+ peers, which is healthy, and it receives the new blocks as expected.
     * But what if the node's disk is full, and it's not writing the new blocks to its database? In this case the node is off-sync even
     * though it's technically alive and connected
     * @returns A boolean indicating whether the node is healthy.
     * @throws {InvalidDataTypeError}
     */
    async isHealthy() {
        /**
         * @internal
         * Perform an HTTP GET request using the SimpleNet instance to get the latest block
         */
        const response = await this.blocksModule.getBestBlockCompressed();
        /**
         * timestamp from the last block and, eventually handle errors
         * @internal
         */
        const lastBlockTimestamp = this.getTimestampFromBlock(response);
        /**
         * seconds elapsed since the timestamp of the last block
         * @internal
         */
        const secondsSinceLastBlock = Math.floor(Date.now() / 1000) - lastBlockTimestamp;
        return (Math.abs(secondsSinceLastBlock) <
            utils_1.NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS);
    }
    /**
     * Extracts the timestamp from the block
     * @remarks
     * This function throws an error if the timestamp key does not exist in the response from the API call to the node
     * @param response the response from the API call to the node
     * @returns the timestamp from the block
     * @throws{InvalidDataType}
     */
    getTimestampFromBlock = (response) => {
        if (response === null ||
            response === undefined ||
            typeof response !== 'object' ||
            !('timestamp' in response) ||
            typeof response.timestamp !== 'number') {
            throw new sdk_errors_1.InvalidDataType('NodesModule.getTimestampFromBlock()', 'Sending failed: Input must be a valid raw transaction in hex format.', { response });
        }
        return response?.timestamp;
    };
    /**
     * Retrieves and caches the chainTag from the genesis block of the given ThorClient.
     * Uses the same short-circuit caching logic as eth_chainId().
     */
    async getChaintag() {
        const cached = chainTagCache.get(this.blocksModule);
        if (cached !== undefined)
            return cached;
        const genesisBlock = await this.blocksModule.getGenesisBlock();
        if (!genesisBlock?.id) {
            throw new sdk_errors_1.InvalidDataType('NodesModule.getChaintag()', 'The genesis block id is null or undefined. Unable to get the chain tag.', { url: this.blocksModule.httpClient.baseURL });
        }
        // derive chainTag from last byte of the genesis block id
        const chainTag = Number(`0x${genesisBlock.id.slice(-2)}`);
        if (Number.isNaN(chainTag)) {
            throw new sdk_errors_1.InvalidDataType('NodesModule.getChaintag()', 'Invalid genesis block id. Unable to derive chain tag.', { id: genesisBlock.id });
        }
        chainTagCache.set(this.blocksModule, chainTag);
        return chainTag;
    }
}
exports.NodesModule = NodesModule;
