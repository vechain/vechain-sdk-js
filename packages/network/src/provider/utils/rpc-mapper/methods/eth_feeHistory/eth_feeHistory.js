"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethFeeHistory = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const const_1 = require("../../../const");
/**
 * RPC Method eth_feeHistory implementation for Galactica hardfork
 *
 * @link [eth_feeHistory](https://ethereum.github.io/execution-apis/api-documentation/)
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: blockCount - number of blocks in the requested range
 *                 * params[1]: newestBlock - highest block of the requested range
 *                 * params[2]: rewardPercentiles - optional array of percentiles to compute
 * @param provider - The provider instance to use.
 * @returns Fee history for the returned block range
 * @throws {JSONRPCInvalidParams} | {JSONRPCInternalError} | {JSONRPCMethodNotImplemented}
 */
const ethFeeHistory = async (thorClient, params, _provider) => {
    if (!Array.isArray(params) || params.length < 2) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_feeHistory', 'Invalid input params for "eth_feeHistory" method.', { params });
    }
    // Check if Galactica hardfork has happened
    const galacticaForked = await thorClient.forkDetector.detectGalactica();
    if (!galacticaForked) {
        throw new sdk_errors_1.JSONRPCMethodNotImplemented('eth_feeHistory', 'Method "eth_feeHistory" is not available before Galactica hardfork.', { url: thorClient.httpClient.baseURL });
    }
    const blockCount = params[0];
    const newestBlock = params[1];
    const rewardPercentiles = params[2];
    // Validate newestBlock is a string or number
    if (typeof newestBlock !== 'string' && typeof newestBlock !== 'number') {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_feeHistory', 'Invalid newestBlock parameter. Must be a string or number.', { newestBlock });
    }
    // Validate blockCount is a valid number
    const blockCountNum = Number(blockCount);
    if (!Number.isFinite(blockCountNum) || blockCountNum <= 0) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_feeHistory', 'blockCount must be a positive finite number.', { blockCount, blockCountNum });
    }
    // convert default block to revision
    const revision = (0, const_1.DefaultBlockToRevision)(newestBlock);
    try {
        return await thorClient.gas.getFeeHistory({
            blockCount: blockCountNum,
            newestBlock: revision.toString(),
            rewardPercentiles
        });
    }
    catch (e) {
        if (e instanceof sdk_errors_1.JSONRPCInvalidParams) {
            throw e;
        }
        throw new sdk_errors_1.JSONRPCInternalError('eth_feeHistory()', 'Method "eth_feeHistory" failed.', {
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethFeeHistory = ethFeeHistory;
