import { type HttpClient, type HttpPath } from '@common/http';
import { type ThorRequest, type ThorResponse } from '@thor/thorest';
import { Status } from '@thor/thorest/node/model';
import { type StatusJSON } from '@thor/thorest/json';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

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
     * @throws HttpError if the request fails or returns an error response.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<GetTxPoolStatus, Status>> {
        const fqp = `GetTxPoolStatus.askTo`;
        // http request - this will throw HttpError if the request fails
        const response = await httpClient.get(GetTxPoolStatus.PATH, {
            query: ''
        });
        // parse the not nullable response - this will throw InvalidThorestResponseError if the response cannot be parsed
        const status = await parseResponseHandler<Status, StatusJSON>(
            fqp,
            response,
            Status,
            false
        );
        // return a thor response
        return {
            request: this,
            response: status
        };
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
