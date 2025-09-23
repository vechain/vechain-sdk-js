import { type HttpClient, type HttpPath } from '@common/http';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor/thorest';
import { Status } from '@thor/thorest/node/model';
import { type StatusJSON } from '@thor/thorest/json';

/**
 * Full-Qualified-Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/node/methods/GetTxPoolStatus.ts/GetTxPoolStatus.ts';

/**
 * [Get txpool status](http://localhost:8669/doc/stoplight-ui/#/paths/node-txpool-status/get)
 */
class GetTxPoolStatus implements ThorRequest<GetTxPoolStatus, Status> {
    /**
     * Represents the HTTP path configuration for the transaction pool status endpoint.
     */
    protected static readonly PATH: HttpPath = { path: '/node/txpool/status' };

    /**
     * Protected class constructor to initialize the class.
     * This constructor is not accessible outside the containing class or its subclasses.
     */
    protected constructor() {}

    /**
     * Sends a request to retrieve transaction pool status and handles the response.
     *
     * @param httpClient The HTTP client used to send the request.
     * @throws ThorError if the request fails or returns an error response.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<GetTxPoolStatus, Status>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient)<Promise<ThorResponse<GetTxPoolStatus, Status>> >`;
        const response = await httpClient.get(GetTxPoolStatus.PATH, {
            query: ''
        });
        if (response.ok) {
            const json = (await response.json()) as StatusJSON;
            try {
                return {
                    request: this,
                    response: new Status(json)
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
        } else {
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
    }

    /**
     * Creates and returns a new instance of the GetTxPoolStatus class.
     *
     * @return {GetTxPoolStatus} A new instance of the GetTxPoolStatus class.
     */
    static of(): GetTxPoolStatus {
        return new GetTxPoolStatus();
    }
}

export { GetTxPoolStatus };
