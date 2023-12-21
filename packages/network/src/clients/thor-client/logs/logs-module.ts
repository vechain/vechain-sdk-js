import { type HttpClient } from '../../../utils/http';
import {
    type FilterEventLogsOptions,
    type EventLogs,
    type FilterTransferLogsOptions,
    type TransferLogs
} from './types';
import { thorest } from '../../../utils';

/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VechainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsModule {
    /**
     * Initializes a new instance of the `LogsClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    /**
     * Filters event logs based on the provided criteria.
     *
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    public async filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs> {
        return (await this.httpClient.http(
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
        return (await this.httpClient.http(
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
