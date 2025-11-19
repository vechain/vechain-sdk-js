"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3Sha3 = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * RPC Method web3_sha3 implementation
 *
 * @link [web3_sha3](https://docs.alchemy.com/reference/web3-sha3)
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: The data to hash.
 * @returns A string representing the current client version.
 */
const web3Sha3 = async (params) => {
    // Input validation
    if (params.length !== 1 ||
        typeof params[0] !== 'string' ||
        !sdk_core_1.Hex.isValid(params[0]))
        throw new sdk_errors_1.JSONRPCInvalidParams('web3_sha3', `Invalid input params for "web3_sha3" method. See 'https://docs.alchemy.com/reference/web3-sha3' for details.`, { params });
    return await Promise.resolve(sdk_core_1.Keccak256.of(params[0]).toString());
};
exports.web3Sha3 = web3Sha3;
