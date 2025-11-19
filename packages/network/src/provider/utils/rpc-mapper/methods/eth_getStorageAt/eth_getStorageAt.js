"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetStorageAt = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const const_1 = require("../../../const");
/**
 * RPC Method eth_getStorageAt implementation
 *
 * @link [eth_getStorageAt](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the storage slot for as a hex string.
 *               * params[1]: The storage position to get as a hex string.
 *               * params[2]: The block number to get the storage slot at as a hex string or "latest".
 * @returns The storage slot of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetStorageAt = async (thorClient, params) => {
    // Input validation
    if (params.length !== 3 ||
        typeof params[0] !== 'string' ||
        (typeof params[1] !== 'string' && typeof params[1] !== 'bigint') ||
        (params[2] != null &&
            typeof params[2] !== 'object' &&
            typeof params[2] !== 'string')) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getStorageAt', `Invalid input params for "eth_getStorageAt" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    }
    try {
        params[2] ??= 'latest';
        const [address, storagePosition, block] = params;
        // Get the account details
        const storage = await thorClient.accounts.getStorageAt(sdk_core_1.Address.of(address), sdk_core_1.ThorId.of(storagePosition), {
            revision: (0, const_1.DefaultBlockToRevision)(block)
        });
        return storage.toString();
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getStorageAt()', 'Method "eth_getStorageAt" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetStorageAt = ethGetStorageAt;
