import {
    type EventLogs,
    type FilterEventLogsOptions,
    type FilterRawEventLogsOptions,
    type FilterTransferLogsOptions,
    type TransferLogs
} from './types';
import { type EventFragment, thorest } from '../../utils';
import { type ThorClient } from '../thor-client';
import { abi } from '@vechain/sdk-core';

/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VeChainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the VeChain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Filters event logs based on the provided criteria. Raw event logs are not decoded.
     *
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    public async filterRawEventLogs(
        filterOptions: FilterRawEventLogsOptions
    ): Promise<EventLogs[]> {
        return (await this.thor.httpClient.http(
            'POST',
            thorest.logs.post.EVENT_LOGS(),
            {
                query: {},
                body: filterOptions,
                headers: {}
            }
        )) as EventLogs[];
    }

    /**
     * Filters event logs based on the provided criteria and decodes them using the provided fragments.
     * The decoded data is added to the event logs as a new property.
     * The result is an array of event logs grouped by the event topic hash.
     * @param filterOptions
     * @returns A promise that resolves to an array of event logs grouped by event.
     */
    public async filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[][]> {
        // Extract criteria and fragments from filter options
        const criteriaSet = filterOptions.criteriaSet?.map((c) => c.criteria);
        const fragments = filterOptions.criteriaSet?.map(
            (c) => c.eventFragment
        );

        // Create new filter options with the criteria set
        const filterRawEventLogsOptions: FilterRawEventLogsOptions = {
            range: filterOptions.range ?? {
                unit: 'block',
                from: 0,
                to: (await this.thor.blocks.getBestBlockCompressed())?.number
            },
            criteriaSet,
            options: filterOptions.options,
            order: filterOptions.order ?? 'asc'
        };

        // Filter event logs based on the provided criteria
        const eventLogs = await this.filterRawEventLogs(
            filterRawEventLogsOptions
        );

        const result = new Map<string, EventLogs[]>();

        if (fragments !== null && fragments !== undefined) {
            const uniqueFragments = this.removeDuplicatedFragments(fragments);

            // Initialize the result map with empty arrays for each unique fragment
            uniqueFragments.forEach((f) => result.set(f.topicHash, []));

            eventLogs.forEach((log) => {
                const eventFragment = new abi.Event(
                    uniqueFragments.get(log.topics[0])
                );
                log.decodedData = eventFragment.decodeEventLog(log);
                result.get(log.topics[0])?.push(log);
            });
        }

        return Array.from(result.values());
    }

    /**
     * Removes duplicated fragments from the provided array. Fragments are considered duplicated if they have the same topic hash.
     * @param fragments - An array of event fragments.
     * @private Returns a map of unique fragments.
     */
    private removeDuplicatedFragments(
        fragments: EventFragment[]
    ): Map<string, EventFragment> {
        const uniqueFragments = new Map<string, EventFragment>();

        fragments.forEach((obj) => {
            if (!uniqueFragments.has(obj.topicHash)) {
                uniqueFragments.set(obj.topicHash, obj);
            }
        });

        return uniqueFragments;
    }

    /**
     * Filters transfer logs based on the provided criteria.
     *
     * @param filterOptions - An object specifying filtering criteria for transfer logs.
     * @returns A promise that resolves to filtered transfer logs.
     */
    public async filterTransferLogs(
        filterOptions: FilterTransferLogsOptions
    ): Promise<TransferLogs[]> {
        return (await this.thor.httpClient.http(
            'POST',
            thorest.logs.post.TRANSFER_LOGS(),
            {
                query: {},
                body: filterOptions,
                headers: {}
            }
        )) as TransferLogs[];
    }
}

export { LogsModule };
