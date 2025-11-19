"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedChainTag = exports.getCachedChainId = exports.ethChainId = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const const_1 = require("../../../const");
// In-memory cache
let cachedChainId = null;
let cachedChainTag = null;
let cachedGenesisBlockId = null;
/**
 * RPC Method eth_chainId implementation
 *
 * @link [eth_chainId](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - ThorClient instance.
 * @returns Returns the block id of the genesis block.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethChainId = async (thorClient) => {
    try {
        if (cachedChainId !== null)
            return cachedChainId.toString();
        const genesisBlock = await thorClient.blocks.getGenesisBlock();
        if (genesisBlock?.id === null || genesisBlock?.id === undefined) {
            throw new sdk_errors_1.JSONRPCInvalidParams('eth_chainId()', 'The genesis block id is null or undefined. Unable to get the chain id.', {
                url: thorClient.httpClient.baseURL
            });
        }
        if (!sdk_core_1.Hex.isValid(genesisBlock.id)) {
            throw new sdk_errors_1.JSONRPCInvalidParams('eth_chainId()', 'The genesis block id is invalid. Unable to get the chain id.', {
                url: thorClient.httpClient.baseURL
            });
        }
        cachedGenesisBlockId = sdk_core_1.Hex.of(genesisBlock.id);
        cachedChainTag = sdk_core_1.HexUInt.of(cachedGenesisBlockId.bytes.slice(-1));
        cachedChainId = (0, const_1.chainTagToChainId)(cachedChainTag);
        return cachedChainId.toString();
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_chainId()', 'Method "eth_chainId" failed.', {
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethChainId = ethChainId;
/*
 * Get the chain id from the cached value or fetch it from the network.
 *
 * @param thorClient - ThorClient instance.
 * @returns The chain id.
 */
const getCachedChainId = async (thorClient) => {
    return cachedChainId !== null
        ? cachedChainId.toString()
        : await ethChainId(thorClient);
};
exports.getCachedChainId = getCachedChainId;
/*
 * Get the chain tag from the cached value or fetch it from the network.
 *
 * @param thorClient - ThorClient instance.
 * @returns The chain tag.
 */
const getCachedChainTag = async (thorClient) => {
    return cachedChainTag !== null
        ? cachedChainTag.toString()
        : await ethChainId(thorClient);
};
exports.getCachedChainTag = getCachedChainTag;
