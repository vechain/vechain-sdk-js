"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethBlockNumber = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Method eth_blockNumber implementation
 *
 * @link [eth_blockNumber](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @returns the latest block number as a hex string. If the block number cannot be retrieved, it will return '0x0'
 * @throws {JSONRPCInternalError}
 */
const ethBlockNumber = async (thorClient) => {
    try {
        // 'best' is the alias for 'latest' in VeChainThorest
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        return latestBlock?.number !== undefined
            ? `0x${latestBlock.number.toString(16)}`
            : '0x0';
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_blockNumber()', 'Method "eth_blockNumber" failed.', {
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethBlockNumber = ethBlockNumber;
