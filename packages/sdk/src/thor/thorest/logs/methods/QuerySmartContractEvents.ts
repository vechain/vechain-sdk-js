import {
    EventLogFilterRequest,
    EventLogsResponse,
    ThorError,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { type EventLogsResponseJSON } from '@thor/thorest/logs/json';
import { type HttpClient, type HttpPath } from '@common/http';
import { type EventLogFilter } from '@thor/thor-client/model/logs/EventLogFilter';

/**
 * Full-Qualified-Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/logs/methods/QuerySmartContractEvents.ts!';

/**
 * [Query smart contract events](http://localhost:8669/doc/stoplight-ui/#/paths/logs-event/post)
 */
class QuerySmartContractEvents
    implements ThorRequest<QuerySmartContractEvents, EventLogsResponse>
{
    /**
     * Represents the HTTP path configuration for accessing resources.
     */
    protected static readonly PATH: HttpPath = { path: '/logs/event' };

    /**
     * Represents a request object that can be used to filter event logs.
     */
    protected readonly request: EventLogFilterRequest;

    /**
     * Constructs an instance of the class with the provided EventLogFilterRequest.
     *
     * @param {EventLogFilterRequest} request - The filter request object that contains parameters for event log filtering.
     */
    constructor(request: EventLogFilterRequest) {
        this.request = request;
    }

    /**
     * Sends a request to query smart contract events and processes the response.
     *
     * @param {HttpClient} httpClient - The HTTP client used for making the request.
     * @return {Promise<ThorResponse<QuerySmartContractEvents, EventLogsResponse>>}
     * A promise that resolves to a ThorResponse containing the request data and processed response,
     * or rejects with an error if the response is invalid or if the request fails.
     * @throws ThorError If there is an error while processing the response or if the response status is not OK.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<QuerySmartContractEvents, EventLogsResponse>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<QuerySmartContractEvents, EventLogsResponse>>`;
        const response = await httpClient.post(
            QuerySmartContractEvents.PATH,
            { query: '' },
            this.request.toJSON()
        );
        if (response.ok) {
            const json = (await response.json()) as EventLogsResponseJSON;
            try {
                return {
                    request: this,
                    response: new EventLogsResponse(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    error instanceof Error ? error.message : 'Bad response.',
                    {
                        url: response.url,
                        body: json
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        }
        throw new ThorError(
            fqp,
            await response.text(),
            {
                url: response.url
            },
            undefined,
            response.status
        );
    }

    /**
     * Creates a new instance of `QuerySmartContractEvents` using the provided `EventLogFilter`.
     *
     * @param {EventLogFilter} request - The event log filter.
     * @return {QuerySmartContractEvents} A new instance of `QuerySmartContractEvents` initialized with the provided request.
     */
    static of(request: EventLogFilter): QuerySmartContractEvents {
        return new QuerySmartContractEvents(EventLogFilterRequest.of(request));
    }
}

export { QuerySmartContractEvents };
