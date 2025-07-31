import { type HttpClient, type HttpPath } from '@http';
import { TransferLogFilterRequest, TransferLogsResponse } from '@thor/logs';
import {
    type TransferLogsResponseJSON,
    type TransferLogFilterRequestJSON
} from '@thor/thorest/json';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/QueryVETTransferEvents.ts!';

/**
 * [Query VET transfer events](http://localhost:8669/doc/stoplight-ui/#/paths/logs-transfer/post)
 */
class QueryVETTransferEvents
    implements ThorRequest<QueryVETTransferEvents, TransferLogsResponse>
{
    /**
     * Represents the HTTP path configuration used to define a specific route.
     */
    protected static readonly PATH: HttpPath = { path: '/logs/transfer' };

    /**
     * Represents a request to filter transfer logs based on specific criteria.
     *
     * This object is used to define the filtering parameters for retrieving transfer log data.
     * It allows users to specify conditions such as date ranges, log levels, and other attributes
     * to narrow down the search results.
     */
    protected readonly request: TransferLogFilterRequest;

    /**
     * Protected constructor for initializing the instance with a TransferLogFilterRequest.
     *
     * @param {TransferLogFilterRequest} request - The transfer log filter request to initialize the instance with.
     */
    protected constructor(request: TransferLogFilterRequest) {
        this.request = request;
    }

    /**
     * Sends a post request using the provided HttpClient to execute a query for VET transfer events.
     * Constructs a response object upon successful execution or throws an error otherwise.
     *
     * @param {HttpClient} httpClient - The HTTP client instance used to send the request.
     * @return {Promise<ThorResponse<QueryVETTransferEvents, TransferLogsResponse>>} A promise that resolves to a ThorResponse containing the query and the transfer logs response, or rejects with a ThorError in case of an error.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<QueryVETTransferEvents, TransferLogsResponse>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<QueryVETTransferEvents, TransferLogsResponse>>`;
        const response = await httpClient.post(
            QueryVETTransferEvents.PATH,
            { query: '' },
            this.request.toJSON()
        );
        if (response.ok) {
            const json = (await response.json()) as TransferLogsResponseJSON;
            try {
                return {
                    request: this,
                    response: new TransferLogsResponse(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    'Bad response.',
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
     * Creates and returns an instance of QueryVETTransferEvents using the provided TransferLogFilterRequestJSON object.
     *
     * @param {TransferLogFilterRequestJSON} request - The JSON object containing the transfer log filter request details.
     * @return {QueryVETTransferEvents} A new instance of QueryVETTransferEvents initialized with the specified filter request.
     */
    static of(request: TransferLogFilterRequestJSON): QueryVETTransferEvents {
        return new QueryVETTransferEvents(
            new TransferLogFilterRequest(request)
        );
    }
}

export { QueryVETTransferEvents };
