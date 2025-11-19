"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.netVersion = void 0;
const eth_chainId_1 = require("../eth_chainId");
/**
 * RPC Method net_version implementation
 *
 * @link [net_version](https://docs.infura.io/networks/ethereum/json-rpc-methods/net_version)
 *
 * @param thorClient - ThorClient instance.
 *
 * @returns The net version (equivalent to chain id in our case).
 */
const netVersion = async (thorClient) => {
    return await (0, eth_chainId_1.ethChainId)(thorClient);
};
exports.netVersion = netVersion;
