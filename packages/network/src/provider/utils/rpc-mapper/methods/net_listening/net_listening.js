"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.netListening = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Method net_listening implementation
 *
 * @link [net_listening](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/net_listening)
 *
 * @param thorClient - The thor client instance to use.
 */
const netListening = async (thorClient) => {
    try {
        return await thorClient.nodes.isHealthy();
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('net_listening()', 'Method "net_listening" failed.', {
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.netListening = netListening;
