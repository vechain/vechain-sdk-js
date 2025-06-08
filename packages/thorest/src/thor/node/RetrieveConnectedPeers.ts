import { GetPeersResponse, type GetPeersResponseJSON } from '@thor/node';
import { type HttpClient, type HttpPath } from '@http';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/node/RetrieveConnectedPeers.ts!';

/**
 * [Retrieve connected peers](http://localhost:8669/doc/stoplight-ui/#/paths/node-network-peers/get)
 *
 * Represents a request to retrieve information about connected peers in the network.
 * Implements ThorRequest interface for handling peer information retrieval.
 * @implements {ThorRequest<RetrieveConnectedPeers, GetPeersResponse>}
 */
class RetrieveConnectedPeers
    implements ThorRequest<RetrieveConnectedPeers, GetPeersResponse | null>
{
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
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveConnectedPeers, GetPeersResponse | null>>`;
        const response = await httpClient.get(RetrieveConnectedPeers.PATH, {
            query: ''
        });
        if (response.ok) {
            const json: GetPeersResponseJSON | null =
                (await response.json()) as GetPeersResponseJSON;
            try {
                return {
                    request: this,
                    response: json === null ? null : new GetPeersResponse(json)
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
     * Creates and returns a new instance of the RetrieveConnectedPeers class.
     *
     * @return {RetrieveConnectedPeers} A new instance of RetrieveConnectedPeers.
     */
    static of(): RetrieveConnectedPeers {
        return new RetrieveConnectedPeers();
    }
}

export { RetrieveConnectedPeers };
