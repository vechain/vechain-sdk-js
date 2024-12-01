import { type BlockId, type UInt } from '@vechain/sdk-core';

export interface PeerResponse {
    name: string;
    bestBlockID: BlockId;
    totalScore: UInt;
    peerID: string;
    netAddr: string;
    inbound: boolean;
    duration: UInt;
}
