import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type PeerResponse } from './PeerResponse';
import { BlockId, UInt } from '@vechain/sdk-core';

class RetrieveConnectedPeers implements ThorRequest {
    public static readonly PATH: HttpPath = { path: '/node/network/peers' };

    async askTo(httpClient: HttpClient): Promise<PeerResponse[]> {
        const response = await httpClient.get(RetrieveConnectedPeers.PATH);
        const responseBody: ResponseElement[] =
            (await response.json()) as ResponseElement[];
        return responseBody.map((peer) => {
            return {
                name: peer.name,
                bestBlockID: BlockId.of(peer.bestBlockID),
                totalScore: UInt.of(peer.totalScore),
                peerID: peer.peerID,
                netAddr: peer.netAddr,
                inbound: peer.inbound,
                duration: UInt.of(peer.duration)
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
