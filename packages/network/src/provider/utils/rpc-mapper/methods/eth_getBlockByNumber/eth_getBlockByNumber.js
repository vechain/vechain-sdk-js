"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetBlockByNumber = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const const_1 = require("../../../const");
const formatter_1 = require("../../../formatter");
const eth_chainId_1 = require("../eth_chainId");
/**
 * RPC Method eth_getBlockByNumber implementation
 *
 * @link [eth_getBlockByNumber](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note
 *  * Standard RPC method `eth_getBlockByNumber` support following block numbers: hex number of block, 'earliest', 'latest', 'safe', 'finalized', 'pending'. (@see https://ethereum.org/en/developers/docs/apis/json-rpc#default-block)
 *  * Currently, VeChainonly supports hex number of block, 'latest' and 'finalized'.
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block number to get as a hex string or "latest" or "finalized".
 *                 * params[1]: The transaction detail flag. If true, the block will contain the transaction details, otherwise it will only contain the transaction hashes.
 * @returns the block at the given block number formatted to the RPC standard or null if the block does not exist.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBlockByNumber = async (thorClient, params) => {
    // Input validation
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'boolean')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getBlockByNumber', `Invalid input params for "eth_getBlockByNumber" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    try {
        const [blockNumber, isTxDetail] = params;
        const revision = (0, const_1.DefaultBlockToRevision)(blockNumber);
        let chainId = '0x0';
        // If the transaction detail flag is set, we need to get the chain id
        if (isTxDetail) {
            chainId = await (0, eth_chainId_1.ethChainId)(thorClient);
        }
        const block = isTxDetail
            ? await thorClient.blocks.getBlockExpanded(revision.toString())
            : await thorClient.blocks.getBlockCompressed(revision.toString());
        return block !== null
            ? formatter_1.blocksFormatter.formatToRPCStandard(block, chainId)
            : null;
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getBlockByNumber()', 'Method "eth_getBlockByNumber" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetBlockByNumber = ethGetBlockByNumber;
