"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetUncleCountByBlockHash = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
/**
 * RPC Method eth_getUncleCountByBlockHash implementation
 *
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash to get as a hex string.
 */
const ethGetUncleCountByBlockHash = async (params) => {
    // Input validation
    if (params.length !== 1 ||
        typeof params[0] !== 'string' ||
        !sdk_core_1.ThorId.isValid(params[0]))
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getUncleCountByBlockHash', `Invalid input params for "eth_getUncleCountByBlockHash" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    return await Promise.resolve(0);
};
exports.ethGetUncleCountByBlockHash = ethGetUncleCountByBlockHash;
