import { GetPeersResponse } from '@thor/thorest/node';
import { type GetPeersResponseJSON } from '@thor/thorest/json';
import { type HttpClient, type HttpPath } from '@common/http';
import { type ThorRequest, type ThorResponse } from '@thor/thorest';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * [Retrieve connected peers](http://localhost:8669/doc/stoplight-ui/#/paths/node-network-peers/get)
 *
 * Represents a request to retrieve information about connected peers in the network.
 * Implements ThorRequest interface for handling peer information retrieval.
 * @implements {ThorRequest<RetrieveConnectedPeers, GetPeersResponse>}
 */
class RetrieveConnectedPeers implements ThorRequest<
    RetrieveConnectedPeers,
    GetPeersResponse | null
> {
    /**
     * The endpoint path for retrieving connected peers information
     * @private
     * @readonly
     */
    private static readonly PATH: HttpPath = { path: '/node/network/peers' };

    /**
     * Protected class constructor to initialize the class.
     * This constructor is not accessible outside the containing class or its subclasses.
     */
    protected constructor() {}

    /**
     * Sends a request to retrieve connected peers.
     *
     * @param {HttpClient} httpClient - The HTTP client used to perform the request.
     * @return {Promise<ThorResponse<RetrieveConnectedPeers, GetPeersResponse | null>>}
     *         A promise that resolves to a ThorResponse containing the request details and response data,
     *         or throws an error if the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveConnectedPeers, GetPeersResponse | null>> {
        const fqp = `RetrieveConnectedPeers.askTo`;
        // http request - this will throw HttpError if the request fails
        const response = await httpClient.get(RetrieveConnectedPeers.PATH, {
            query: ''
        });
        // parse the not nullable response - this will throw InvalidThorestResponseError if the response cannot be parsed
        const peersResponse = await parseResponseHandler<
            GetPeersResponse,
            GetPeersResponseJSON
        >(fqp, response, GetPeersResponse, false);
        // return a thor response
        return {
            request: this,
            response: peersResponse
        };
    }

    /**
     * Creates and returns a new instance of the RetrieveConnectedPeers class.
     *
     * @return {RetrieveConnectedPeers} A new instance of RetrieveConnectedPeers.
     */
    static of(): RetrieveConnectedPeers {
        return new RetrieveConnectedPeers();
    }
}

export { RetrieveConnectedPeers };
