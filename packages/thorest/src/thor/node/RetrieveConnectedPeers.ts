import { GetPeersResponse, type GetPeersResponseJSON } from '@thor/node';
import { type HttpClient, type HttpPath } from '@http';
import { type ThorRequest, type ThorResponse } from '@thor';
/**
 * Represents a request to retrieve information about connected peers in the network.
 * Implements ThorRequest interface for handling peer information retrieval.
 * @implements {ThorRequest<RetrieveConnectedPeers, GetPeersResponse>}
 */
class RetrieveConnectedPeers
    implements ThorRequest<RetrieveConnectedPeers, GetPeersResponse>
{
    /**
     * The endpoint path for retrieving connected peers information
     * @private
     * @readonly
     */
    private static readonly PATH: HttpPath = { path: '/node/network/peers' };

    /**
     * Executes the request to retrieve connected peers information
     * @param httpClient - The HTTP client used to make the request
     * @returns {Promise<ThorResponse<RetrieveConnectedPeers, GetPeersResponse>>} Promise resolving to a ThorResponse containing the request and peer information
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveConnectedPeers, GetPeersResponse>> {
        const response = await httpClient.get(RetrieveConnectedPeers.PATH, {
            query: ''
        });
        const responseBody: GetPeersResponseJSON =
            (await response.json()) as GetPeersResponseJSON;
        return {
            request: this,
            response: new GetPeersResponse(responseBody)
        };
    }
}

export { RetrieveConnectedPeers };
