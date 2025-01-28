import { BlockId, UInt } from '@vechain/sdk-core';

class PeerStat {
    readonly name: string;
    readonly bestBlockID: BlockId;
    readonly totalScore: UInt;
    readonly peerID: string;
    readonly netAddr: string;
    readonly inbound: boolean;
    readonly duration: UInt;

    constructor(json: PeerStatJSON) {
        this.name = json.name;
        this.bestBlockID = BlockId.of(json.bestBlockID);
        this.totalScore = UInt.of(json.totalScore);
        this.peerID = json.peerID;
        this.netAddr = json.netAddr;
        this.inbound = json.inbound;
        this.duration = UInt.of(json.duration);
    }

    toJSON(): PeerStatJSON {
        return {
            name: this.name,
            bestBlockID: this.bestBlockID.toString(),
            totalScore: this.totalScore.valueOf(),
            peerID: this.peerID,
            netAddr: this.netAddr,
            inbound: this.inbound,
            duration: this.duration.valueOf()
        };
    }
}

interface PeerStatJSON {
    name: string;
    bestBlockID: string;
    totalScore: number;
    peerID: string;
    netAddr: string;
    inbound: boolean;
    duration: number;
}

export { PeerStat, type PeerStatJSON };
