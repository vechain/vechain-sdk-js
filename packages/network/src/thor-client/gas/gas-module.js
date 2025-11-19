"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasModule = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const http_1 = require("../../http");
const sdk_core_1 = require("@vechain/sdk-core");
const utils_1 = require("../../utils");
/**
 * The `GasModule` handles gas related operations and provides
 * convenient methods for estimating the gas cost of a transaction.
 */
class GasModule {
    httpClient;
    transactionsModule;
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.transactionsModule = null;
    }
    /**
     * Sets the transactions module.
     *
     * @param transactionsModule - The transactions module to set.
     */
    setTransactionsModule(transactionsModule) {
        this.transactionsModule = transactionsModule;
    }
    /**
     * Simulates a transaction and returns an object containing information regarding the gas used and whether the transaction reverted.
     *
     * @note The caller option is suggested as estimation without this parameter may not be accurate.
     *
     * @param clauses - The clauses of the transaction to simulate.
     * @param caller - The address of the account sending the transaction.
     * @param options - Optional parameters for the request. Includes all options of the `simulateTransaction` method excluding the `caller` option.
     *                  @see {@link TransactionsClient#simulateTransaction}
     *                  Also, includes the `gasPadding` option which is a percentage of gas to add on top of the estimated gas. The value must be between (0, 1].
     * @returns An object containing information regarding the gas used and whether the transaction reverted, together with the decoded revert reason and VM errors.
     * @throws{InvalidDataType}
     */
    async estimateGas(clauses, caller, options) {
        if (this.transactionsModule == null) {
            throw new sdk_errors_1.InvalidDataType('estimateGas()', 'Transactions module not set', {});
        }
        return await this.transactionsModule.estimateGas(clauses, caller, options);
    }
    /**
     * Returns the suggested priority fee per gas in wei.
     * This is calculated based on the current base fee and network conditions.
     *
     * @returns Suggested priority fee per gas in wei (hex string)
     * @throws {InvalidDataType}
     */
    async getMaxPriorityFeePerGas() {
        const response = (await this.httpClient.get('/fees/priority'));
        // Validate response
        if (response === null ||
            response === undefined ||
            typeof response !== 'object') {
            throw new sdk_errors_1.InvalidDataType('getMaxPriorityFeePerGas()', 'Invalid response format from /fees/priority endpoint', { response });
        }
        if (response.maxPriorityFeePerGas === undefined ||
            response.maxPriorityFeePerGas === null ||
            response.maxPriorityFeePerGas === '' ||
            typeof response.maxPriorityFeePerGas !== 'string') {
            throw new sdk_errors_1.InvalidDataType('getMaxPriorityFeePerGas()', 'Missing or invalid maxPriorityFeePerGas in response', { response });
        }
        return response.maxPriorityFeePerGas;
    }
    /**
     * Returns fee history for the returned block range.
     *
     * @param options - The options for the fee history request
     * @returns Fee history for the returned block range
     * @throws {InvalidDataType}
     */
    async getFeeHistory(options) {
        if (options === null ||
            options === undefined ||
            typeof options.blockCount !== 'number' ||
            !Number.isFinite(options.blockCount) ||
            options.blockCount <= 0) {
            throw new sdk_errors_1.InvalidDataType('getFeeHistory()', 'Invalid blockCount parameter', { options });
        }
        if (options.newestBlock !== null &&
            options.newestBlock !== undefined &&
            !sdk_core_1.Revision.isValid(options.newestBlock)) {
            throw new sdk_errors_1.InvalidDataType('getFeeHistory()', 'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).', { options });
        }
        const response = await this.httpClient.http(http_1.HttpMethod.GET, utils_1.thorest.fees.get.FEES_HISTORY(options.blockCount, options.newestBlock, options.rewardPercentiles));
        if (response === null ||
            response === undefined ||
            typeof response !== 'object') {
            throw new sdk_errors_1.InvalidDataType('getFeeHistory()', 'Invalid response format from /fees/history endpoint', { response });
        }
        return response;
    }
    /**
     * Returns the base fee per gas of the next block.
     * @returns The base fee per gas of the next block.
     */
    async getNextBlockBaseFeePerGas() {
        const options = {
            blockCount: 1,
            newestBlock: 'next'
        };
        const feeHistory = await this.getFeeHistory(options);
        if (feeHistory.baseFeePerGas === null ||
            feeHistory.baseFeePerGas === undefined ||
            feeHistory.baseFeePerGas.length === 0) {
            return null;
        }
        return sdk_core_1.HexUInt.of(feeHistory.baseFeePerGas[0]).bi;
    }
}
exports.GasModule = GasModule;
