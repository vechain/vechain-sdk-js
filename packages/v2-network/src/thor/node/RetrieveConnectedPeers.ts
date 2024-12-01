import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type PeerResponse } from './PeerResponse';
import { BlockId, UInt } from '@vechain/sdk-core';
import { type GetPeersResponse } from './GetPeersResponse';

class RetrieveConnectedPeers implements ThorRequest {
    public static readonly PATH: HttpPath = { path: '/node/network/peers' };

    async askTo(httpClient: HttpClient): Promise<GetPeersResponse> {
        const response = await httpClient.get(RetrieveConnectedPeers.PATH);
        const responseBody: ResponseElement[] =
            (await response.json()) as ResponseElement[];
        return responseBody.map((responseElement) => {
            return {
                name: responseElement.name,
                bestBlockID: BlockId.of(responseElement.bestBlockID),
                totalScore: UInt.of(responseElement.totalScore),
                peerID: responseElement.peerID,
                netAddr: responseElement.netAddr,
                inbound: responseElement.inbound,
                duration: UInt.of(responseElement.duration)
            } satisfies PeerResponse;
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
