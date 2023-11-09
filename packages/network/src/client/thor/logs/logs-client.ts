import { type HttpClient } from '../../http';
import { type FilterEventLogsArg, type EventLogs } from './types';

class LogsClient {
    /**
     * Initializes a new instance of the `LogsClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    public async filterEventLogs(args: FilterEventLogsArg): Promise<EventLogs> {
        return (await this.httpClient.http('POST', '/logs/event', {
            query: {},
            body: args,
            headers: {}
        })) as EventLogs;
    }
}

export { LogsClient };
