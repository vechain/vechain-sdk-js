import {
    type FilterEventLogsOptions,
    type EventLogs,
    type FilterTransferLogsOptions,
    type TransferLogs
} from './types';
import { thorest } from '../../utils';
import { type ThorClient } from '../thor-client';

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
     * Filters event logs based on the provided criteria.
     *
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    public async filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs> {
        return (await this.thor.httpClient.http(
            'POST',
            thorest.logs.post.EVENT_LOGS(),
            {
                query: {},
                body: filterOptions,
                headers: {}
            }
        )) as EventLogs;
    }

    /**
     * Filters transfer logs based on the provided criteria.
     *
     * @param filterOptions - An object specifying filtering criteria for transfer logs.
     * @returns A promise that resolves to filtered transfer logs.
     */
    public async filterTransferLogs(
        filterOptions: FilterTransferLogsOptions
    ): Promise<TransferLogs> {
        return (await this.thor.httpClient.http(
            'POST',
            thorest.logs.post.TRANSFER_LOGS(),
            {
                query: {},
                body: filterOptions,
                headers: {}
            }
        )) as TransferLogs;
    }
}

export { LogsModule };
