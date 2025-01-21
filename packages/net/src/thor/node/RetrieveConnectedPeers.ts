import {
    GetPeersResponse,
    type GetPeersResponseJSON
} from './GetPeersResponse';
import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';

class RetrieveConnectedPeers
    implements ThorRequest<RetrieveConnectedPeers, GetPeersResponse>
{
    private static readonly PATH: HttpPath = { path: '/node/network/peers' };

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
