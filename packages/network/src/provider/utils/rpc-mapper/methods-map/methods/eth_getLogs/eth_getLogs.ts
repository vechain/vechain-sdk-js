import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import {
    formatToLogsRPC,
    getCriteriaSetForInput,
    type LogsRPC
} from '../../../../formatter/logs';
import {
    type CompressedBlockDetail,
    type EventCriteria,
    type EventLogs,
    type ThorClient
} from '../../../../../../thor-client';

/**
 * RPC Method eth_getLogs implementation
 *
 * @param thorClient - The thor client instance to use.
 *
 * @param params - The standard array of rpc call parameters.
 *
 * @returns An array of log objects, or an empty array if nothing has changed since last poll
 */
const ethGetLogs = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<LogsRPC[]> => {
    // Check input params
    assert(
        'eth_getLogs',
        params.length === 1 && typeof params[0] === 'object',
        DATA.INVALID_DATA_TYPE,
        `Invalid params length, expected 1 object with following properties: \n {` +
            `\taddress: [optional] Contract address (20 bytes) or a list of addresses from which logs should originate.` +
            `\tfromBlock: [optional, default is "latest"] A hexadecimal block number, or the string latest, earliest or pending. See the default block parameter.` +
            `\ttoBlock: [optional, default is "latest"] A hexadecimal block number, or the string latest, earliest or pending. See the default block parameter.` +
            `\ttopics: [optional] Array of 32 bytes DATA topics. Topics are order-dependent.` +
            `\tblockhash: [optional] Restricts the logs returned to the single block referenced in the 32-byte hash blockHash. Using blockHash is equivalent to setting fromBlock and toBlock to the block number referenced in the blockHash. If blockHash is present in in the filter criteria, then neither fromBlock nor toBlock are allowed.` +
            `}`
    );

    // Block max limit
    const MAX_LIMIT = 256;

    // Input params
    const [filterOptions] = params as [
        {
            address?: string | string[];
            fromBlock?: string;
            toBlock?: string;
            topics?: string[];
            blockhash?: string;
        }
    ];

    try {
        // Get the latest block (if fromBlock or toBlock is not defined, we will use the latest block)
        const latestBlock =
            (await thorClient.blocks.getBestBlockCompressed()) as CompressedBlockDetail;

        // Get criteria set from input
        const criteriaSet: EventCriteria[] = getCriteriaSetForInput({
            address: filterOptions.address,
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
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'ethGetLogs' failed: Error while getting logs ${
                params[0] as string
            }\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethGetLogs };
