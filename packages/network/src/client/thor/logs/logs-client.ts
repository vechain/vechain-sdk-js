import { type HttpClient } from '../../http';
import {
    type FilterEventLogsArg,
    type EventLogs,
    type FilterTransferLogsArg,
    type TransferLogs
} from './types';
import { thorest } from '../../../utils';

/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VechainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsClient {
    /**
     * Initializes a new instance of the `LogsClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    /**
     * Filters event logs based on the provided criteria.
     *
     * @param arg - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    public async filterEventLogs(arg: FilterEventLogsArg): Promise<EventLogs> {
        return (await this.httpClient.http(
            'POST',
            thorest.logs.post.EVENT_LOGS(),
            {
                query: {},
                body: arg,
                headers: {}
            }
        )) as EventLogs;
    }

    /**
     * Filters transfer logs based on the provided criteria.
     *
     * @param arg - An object specifying filtering criteria for transfer logs.
     * @returns A promise that resolves to filtered transfer logs.
     */
    public async filterTransferLogs(
        arg: FilterTransferLogsArg
    ): Promise<TransferLogs> {
        return (await this.httpClient.http(
            'POST',
            thorest.logs.post.TRANSFER_LOGS(),
            {
                query: {},
                body: arg,
                headers: {}
            }
        )) as TransferLogs;
    }
}

export { LogsClient };
