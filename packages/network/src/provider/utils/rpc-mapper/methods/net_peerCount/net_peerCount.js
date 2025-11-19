"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.netPeerCount = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Method net_peerCount implementation
 *
 * @link [net_peerCount](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/net_peercount)
 *
 * @param thorClient - The thor client instance to use.
 */
const netPeerCount = async (thorClient) => {
    try {
        const peers = await thorClient.nodes.getNodes();
        return peers.length;
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('net_peerCount()', 'Method "net_peerCount" failed.', {
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.netPeerCount = netPeerCount;
