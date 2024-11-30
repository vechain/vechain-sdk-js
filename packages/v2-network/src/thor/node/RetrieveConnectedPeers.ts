import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type Peer } from './Peer';

class RetrieveConnectedPeers implements ThorRequest {
    public static readonly PATH: HttpPath = { path: '/node/network/peers' };

    async askTo(httpClient: HttpClient): Promise<Peer[]> {
        const response = await httpClient.get(RetrieveConnectedPeers.PATH);
        const responseBody: ResponseElement[] =
            (await response.json()) as ResponseElement[];
        return responseBody.map((peer) => {
            return { name: peer.name };
        });
    }
}

interface ResponseElement {
    name: string;
    bestBlockID: string;
    totalScore: number;
    peerID: string;
    netAddr: string;
    inbound: boolean;
    duration: number;
}

export { RetrieveConnectedPeers };
