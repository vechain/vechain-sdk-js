"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethMaxPriorityFeePerGas = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Method eth_maxPriorityFeePerGas implementation for Galactica hardfork
 * Returns the suggested priority fee per gas in wei.
 * This is calculated based on the current base fee and network conditions.
 *
 * @link [eth_maxPriorityFeePerGas](https://ethereum.github.io/execution-apis/api-documentation/)
 * @param thorClient - The thor client instance to use.
 * @param _params - The standard array of rpc call parameters.
 * @param _provider - The provider instance to use.
 * @returns Suggested priority fee per gas in wei (hex string)
 * @throws {JSONRPCInternalError} | {JSONRPCMethodNotImplemented}
 */
const ethMaxPriorityFeePerGas = async (thorClient, _params, _provider) => {
    try {
        // Check if Galactica hardfork has happened
        const galacticaForked = await thorClient.forkDetector.detectGalactica();
        if (!galacticaForked) {
            throw new sdk_errors_1.JSONRPCMethodNotImplemented('eth_maxPriorityFeePerGas', 'Method "eth_maxPriorityFeePerGas" is not available before Galactica hardfork.', { url: thorClient.httpClient.baseURL });
        }
        return await thorClient.gas.getMaxPriorityFeePerGas();
    }
    catch (e) {
        if (e instanceof sdk_errors_1.JSONRPCInternalError ||
            e instanceof sdk_errors_1.JSONRPCMethodNotImplemented) {
            throw e;
        }
        throw new sdk_errors_1.JSONRPCInternalError('eth_maxPriorityFeePerGas()', 'Method "eth_maxPriorityFeePerGas" failed.', {
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethMaxPriorityFeePerGas = ethMaxPriorityFeePerGas;
