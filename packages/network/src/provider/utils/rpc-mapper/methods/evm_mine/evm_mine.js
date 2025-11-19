"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmMine = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
/**
 * RPC Method evm_mine implementation
 *
 * @link [evm_mine](https://hardhat.org/hardhat-network/docs/explanation/mining-modes)
 *
 * @param thorClient - The thor client instance to use.
 * @returns The new block or null if the block is not available.
 * @throws {JSONRPCInternalError}
 */
const evmMine = async (thorClient) => {
    try {
        const head = await thorClient.blocks.getBestBlockCompressed();
        if (head === null) {
            throw new sdk_errors_1.JSONRPCInternalError('evm_mine()', 'Method "evm_mine" failed. No best block found.', {
                url: thorClient.httpClient.baseURL
            });
        }
        await utils_1.Poll.SyncPoll(() => thorClient.blocks.getHeadBlock()).waitUntil((result) => {
            return result !== head;
        });
        return null;
    }
    catch (e) {
        if (e instanceof sdk_errors_1.JSONRPCInternalError) {
            throw e;
        }
        throw new sdk_errors_1.JSONRPCInternalError('evm_mine()', 'Method "evm_mine" failed.', {
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.evmMine = evmMine;
