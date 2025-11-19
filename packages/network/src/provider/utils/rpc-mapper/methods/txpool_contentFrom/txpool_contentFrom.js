"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txPoolContentFrom = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * RPC Method txpool_contentFrom implementation
 *
 * @link [txpool_contentFrom](https://www.quicknode.com/docs/ethereum/txpool_contentFrom)
 *
 * @note
 *  * We return a constant empty object for now.
 *
 * @param params - The standard array of rpc call parameters.
 * params[0]: The address to get the transaction pool status from
 * @returns The transaction pool status
 */
const txPoolContentFrom = async (params) => {
    // Validate input
    if (params.length !== 1 ||
        typeof params[0] !== 'string' ||
        !sdk_core_1.Address.isValid(params[0]))
        throw new sdk_errors_1.JSONRPCInvalidParams('txpool_contentFrom()', `Invalid input params for "txpool_contentFrom" method. See https://www.quicknode.com/docs/ethereum/txpool_contentFrom for details.`, { params });
    return await Promise.resolve({});
};
exports.txPoolContentFrom = txPoolContentFrom;
