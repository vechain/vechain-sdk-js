"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethEstimateGas = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const const_1 = require("../../../const");
/**
 * RPC Method eth_estimateGas implementation
 *
 * @link [eth_estimateGas](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note At the moment only the `to`, `value` and `data` fields are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The transaction call object.
 *                 * params[1]: A string representing a block number, or one of the string tags latest, earliest, or pending.
 * @returns A hexadecimal number representing the estimation of the gas for a given transaction.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError, JSONRPCTransactionRevertError}
 */
const ethEstimateGas = async (thorClient, params) => {
    // Input validation
    if (params.length < 1 || params.length > 2 || typeof params[0] !== 'object')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_estimateGas', `Invalid input params for "eth_estimateGas" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    try {
        if (params.length === 1) {
            params.push('latest');
        }
        // NOTE: The standard requires block parameter.
        // Here it is ignored and can be added in the future compatibility reasons.
        // (INPUT CHECK TAKE CARE OF THIS)
        const [inputOptions, defaultBlock] = params;
        const revision = (0, const_1.DefaultBlockToRevision)(defaultBlock);
        const estimatedGas = await thorClient.transactions.estimateGas([
            {
                to: inputOptions.to ?? null,
                value: inputOptions.value ?? '0x0',
                data: inputOptions.data ?? '0x'
            }
        ], inputOptions.from, {
            revision: revision
        });
        // Check if the transaction would revert and throw error if so
        if (estimatedGas.reverted) {
            // To get the proper custom error data, we need to run the simulation ourselves
            // because estimateGas doesn't provide access to the raw simulation data
            const simulations = await thorClient.transactions.simulateTransaction([
                {
                    to: inputOptions.to ?? null,
                    value: inputOptions.value ?? '0x0',
                    data: inputOptions.data ?? '0x'
                }
            ], {
                revision: revision,
                caller: inputOptions.from
            });
            // Find the first non-empty revert reason or VM error
            const revertReason = estimatedGas.revertReasons.find((reason) => reason !== '') ??
                estimatedGas.vmErrors.find((error) => error !== '') ??
                'execution reverted';
            // Use the raw simulation data as revert data for hardhat-chai-matchers
            // This should contain the encoded custom error information
            let revertData = simulations[0].data || '0x';
            // Make sure revertData is a valid hex string
            if (!revertData.startsWith('0x')) {
                revertData = '0x' + revertData;
            }
            throw new sdk_errors_1.JSONRPCTransactionRevertError(revertReason.toString(), revertData);
        }
        // Convert intrinsic gas to hex string and return
        return sdk_core_1.HexUInt.of(estimatedGas.totalGas).toString(true);
    }
    catch (e) {
        // Re-throw JSONRPCTransactionRevertError as-is
        if (e instanceof sdk_errors_1.JSONRPCTransactionRevertError) {
            throw e;
        }
        // Check if this is a network communication error
        if (e instanceof sdk_errors_1.HttpNetworkError) {
            throw new sdk_errors_1.JSONRPCInternalError('eth_estimateGas()', 'Method "eth_estimateGas" failed due to network communication error.', {
                params: (0, sdk_errors_1.stringifyData)(params),
                url: thorClient.httpClient.baseURL,
                networkError: true,
                networkErrorType: e.data.networkErrorType,
                innerError: (0, sdk_errors_1.stringifyData)(e)
            });
        }
        throw new sdk_errors_1.JSONRPCInternalError('eth_estimateGas()', 'Method "eth_estimateGas" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethEstimateGas = ethEstimateGas;
