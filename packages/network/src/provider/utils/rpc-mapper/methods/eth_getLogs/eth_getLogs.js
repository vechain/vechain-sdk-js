"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGetLogs = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const formatter_1 = require("../../../formatter");
const utils_1 = require("../../../../../utils");
/**
 * RPC Method eth_getLogs implementation
 *
 * @link [eth_getLogs](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @returns An array of log objects, or an empty array if nothing has changed since last poll
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetLogs = async (thorClient, params) => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'object')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_getLogs', `Invalid input params for "eth_getLogs" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    // Block max limit
    const MAX_LIMIT = 1000;
    // Input params
    const [filterOptions] = params;
    try {
        // Get the latest block (if fromBlock or toBlock is not defined, we will use the latest block)
        const latestBlock = (await thorClient.blocks.getBestBlockCompressed());
        // Get criteria set from input
        const criteriaSet = (0, formatter_1.getCriteriaSetForInput)({
            address: filterOptions.address !== null
                ? filterOptions.address
                : undefined,
            topics: filterOptions.topics
        });
        // Call thor client to get logs
        const logs = await thorClient.logs.filterRawEventLogs({
            range: {
                unit: 'block',
                from: filterOptions.fromBlock !== undefined
                    ? parseInt(filterOptions.fromBlock, 16)
                    : latestBlock.number,
                to: filterOptions.toBlock !== undefined
                    ? parseInt(filterOptions.toBlock, 16)
                    : latestBlock.number
            },
            criteriaSet,
            order: 'asc',
            options: {
                offset: 0,
                limit: MAX_LIMIT
            }
        });
        // Format logs to RPC
        return (0, formatter_1.formatToLogsRPC)(logs);
    }
    catch (e) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_getLogs()', 'Method "eth_getLogs" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL,
            innerError: (0, sdk_errors_1.stringifyData)(e)
        });
    }
};
exports.ethGetLogs = ethGetLogs;
