"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethCall = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const const_1 = require("../../../const");
/**
 * RPC Method eth_call implementation
 *
 * @link [eth_call](https://ethereum.github.io/execution-apis/api-documentation/)
 * @param thorClient - The thor client instance to use.
 * @param params - The transaction call object
 * @returns The return value of executed contract.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethCall = async (thorClient, params) => {
    // Input validation
    if (params.length !== 2 ||
        typeof params[0] !== 'object' ||
        (typeof params[1] !== 'object' && typeof params[1] !== 'string')) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_call', `Invalid input params for "eth_call" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    }
    try {
        const [inputOptions, block] = params;
        // Simulate transaction
        const simulatedTx = await thorClient.transactions.simulateTransaction([
            {
                to: inputOptions.to ?? null,
                value: inputOptions.value ?? '0x0',
                data: inputOptions.data ?? '0x0'
            }
        ], {
            revision: (0, const_1.DefaultBlockToRevision)(block),
            gas: inputOptions.gas !== undefined
                ? parseInt(inputOptions.gas, 16)
                : undefined,
            gasPrice: inputOptions.gasPrice ?? inputOptions.gasPrice,
            caller: inputOptions.from
        });
        if (simulatedTx[0].reverted) {
            throw new sdk_errors_1.JSONRPCTransactionRevertError(simulatedTx[0].vmError, simulatedTx[0].data);
        }
        // Return simulated transaction data
        return simulatedTx[0].data;
    }
    catch (e) {
        if (e instanceof sdk_errors_1.JSONRPCInternalError) {
            throw e;
        }
        if (e instanceof sdk_errors_1.JSONRPCTransactionRevertError) {
            throw e;
        }
        // Check if this is a network communication error
        if (e instanceof sdk_errors_1.HttpNetworkError) {
            throw new sdk_errors_1.JSONRPCInternalError('eth_call()', 'Method "eth_call" failed due to network communication error.', {
                params: (0, sdk_errors_1.stringifyData)(params),
                url: thorClient.httpClient.baseURL,
                networkError: true,
                networkErrorType: e.data.networkErrorType,
                innerError: (0, sdk_errors_1.stringifyData)(e)
            });
        }
        throw new sdk_errors_1.JSONRPCInternalError('eth_call()', 'Method "eth_call" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethCall = ethCall;
