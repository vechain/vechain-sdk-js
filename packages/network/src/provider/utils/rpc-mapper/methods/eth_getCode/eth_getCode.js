"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetCode = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const const_1 = require("../../../const");
/**
 * RPC Method eth_getCode implementation
 *
 * @link [eth_getCode](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the code for as a hex string.
 *               * params[1]: The block number to get the code at as a hex string or "latest".
 * @returns The code of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInternalError}
 */
const ethGetCode = async (thorClient, params) => {
    // Input validation
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        (typeof params[1] !== 'object' && typeof params[1] !== 'string'))
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getCode', `Invalid input params for "eth_getCode" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    try {
        const [address, block] = params;
        // Get the account bytecode
        const bytecode = await thorClient.accounts.getBytecode(sdk_core_1.Address.of(address), {
            revision: (0, const_1.DefaultBlockToRevision)(block)
        });
        return bytecode.toString();
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getCode()', 'Method "eth_getCode" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetCode = ethGetCode;
