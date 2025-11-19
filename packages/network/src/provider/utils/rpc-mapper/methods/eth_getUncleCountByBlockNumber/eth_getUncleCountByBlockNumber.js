"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetUncleCountByBlockNumber = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
/**
 * RPC Method eth_getUncleCountByBlockNumber implementation
 *
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block number to get as a hex string or "latest" or "finalized".
 */
const ethGetUncleCountByBlockNumber = async (params) => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getUncleCountByBlockNumber', `Invalid input params for "eth_getUncleCountByBlockNumber" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    return await Promise.resolve(0);
};
exports.ethGetUncleCountByBlockNumber = ethGetUncleCountByBlockNumber;
