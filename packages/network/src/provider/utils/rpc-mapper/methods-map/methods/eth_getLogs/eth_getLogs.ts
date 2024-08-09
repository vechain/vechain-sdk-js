import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import {
    formatToLogsRPC,
    getCriteriaSetForInput,
    type LogsRPC
} from '../../../../formatter';
import {
    type CompressedBlockDetail,
    type EventCriteria,
    type EventLogs,
    type ThorClient
} from '../../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

/**
 * RPC Method eth_getLogs implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @returns An array of log objects, or an empty array if nothing has changed since last poll
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetLogs = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<LogsRPC[]> => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'object')
        throw new JSONRPCInvalidParams(
            'eth_getLogs',
            -32602,
            `Invalid input params for "eth_getLogs" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    // Block max limit
    const MAX_LIMIT = 1000;

    // Input params
    const [filterOptions] = params as [
        {
            address?: string | string[] | null;
            fromBlock?: string;
            toBlock?: string;
            topics?: string[] | string[][];
            blockhash?: string;
        }
    ];

    try {
        // Get the latest block (if fromBlock or toBlock is not defined, we will use the latest block)
        const latestBlock =
            (await thorClient.blocks.getBestBlockCompressed()) as CompressedBlockDetail;

        // Get criteria set from input
        const criteriaSet: EventCriteria[] = getCriteriaSetForInput({
            address:
                filterOptions.address !== null
                    ? filterOptions.address
                    : undefined,
            topics: filterOptions.topics
        });

        // Call thor client to get logs
        const logs: EventLogs[] = await thorClient.logs.filterRawEventLogs({
            range: {
                unit: 'block',
                from:
                    filterOptions.fromBlock !== undefined
                        ? parseInt(filterOptions.fromBlock, 16)
                        : latestBlock.number,
                to:
                    filterOptions.toBlock !== undefined
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
        return formatToLogsRPC(logs);
    } catch (e) {
        throw new JSONRPCInternalError(
            'ethGetLogs()',
            -32603,
            'Method "ethGetLogs" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetLogs };
