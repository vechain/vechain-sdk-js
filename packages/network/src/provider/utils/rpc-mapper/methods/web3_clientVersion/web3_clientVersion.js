"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3ClientVersion = void 0;
/**
 * RPC Method web3_clientVersion implementation
 *
 * @link [web3_clientVersion](https://docs.infura.io/networks/ethereum/json-rpc-methods/web3_clientversion)
 *
 * @returns A string representing the current client version.
 */
const web3ClientVersion = async () => {
    return await Promise.resolve('thor');
};
exports.web3ClientVersion = web3ClientVersion;
