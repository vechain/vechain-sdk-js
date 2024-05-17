import {
    type EventLogs,
    type FilterEventLogsOptions,
    type FilterRawEventLogsOptions,
    type FilterTransferLogsOptions,
    type TransferLogs
} from './types';
import { thorest } from '../../utils';
import { type ThorClient } from '../thor-client';
import { abi } from '../../../../core';
import { buildError, ERROR_CODES } from '@vechain/sdk-errors';

/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VechainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the vechain blockchain API.
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
     * @param filterOptions
     */
    public async filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[]> {
        // Extract criteria and fragments from filter options
        const criteriaSet = filterOptions.criteriaSet?.map((c) => c.criteria);
        const fragments = filterOptions.criteriaSet?.map(
            (c) => c.eventFragment
        );

        // Create new filter options with the criteria set
        const filterRawEventLogsOptions: FilterRawEventLogsOptions = {
            range: filterOptions.range,
            criteriaSet,
            options: filterOptions.options,
            order: filterOptions.order
        };

        // Filter event logs based on the provided criteria
        const eventLogs = await this.filterRawEventLogs(
            filterRawEventLogsOptions
        );

        // Decode event logs using the provided fragments. Take the first fragment that matches the topic hash.
        return eventLogs.map((log) => {
            const fragment = fragments?.filter(
                (f) => f.topicHash === log.topics[0]
            );
            if (fragment !== undefined && fragment.length > 0) {
                const eventFragment = new abi.Event(fragment[0]);
                return {
                    ...log,
                    decodedData: eventFragment.decodeEventLog(log)
                };
            } else {
                throw buildError(
                    'filterEventLogs',
                    ERROR_CODES.ABI.INVALID_EVENT,
                    `No matching event fragment found for topic hash: ${log.topics[0]}`,
                    { log }
                );
            }
        });
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
