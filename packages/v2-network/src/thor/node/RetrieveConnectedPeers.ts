import { PeerResponse, type PeerResponseJSON } from './PeerResponse';
import { type GetPeersResponse } from './GetPeersResponse';
import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';

class RetrieveConnectedPeers
    implements ThorRequest<RetrieveConnectedPeers, GetPeersResponse>
{
    public static readonly PATH: HttpPath = { path: '/node/network/peers' };

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveConnectedPeers, GetPeersResponse>> {
        const response = await httpClient.get(RetrieveConnectedPeers.PATH);
        const responseBody: PeerResponseJSON[] =
            (await response.json()) as PeerResponseJSON[];
        const getPeersResponse: GetPeersResponse = responseBody.map(
            (peerResponseJSON) => {
                return new PeerResponse(peerResponseJSON);
            }
        );
        return {
            request: this,
            response: getPeersResponse
        };
    }
}

export { RetrieveConnectedPeers };
