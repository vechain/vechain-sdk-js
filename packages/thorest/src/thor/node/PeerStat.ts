import { BlockId } from '@vechain/sdk-core';

import { UInt } from '../../../../core/src/vcdm/UInt';
import { Hex } from '../../../../core/src/vcdm/Hex';
import { NetAddr } from './NetAddr';

class PeerStat {
    readonly name: string;
    readonly bestBlockID: BlockId;
    readonly totalScore: UInt;
    readonly peerID: Hex;
    readonly netAddr: NetAddr;
    readonly inbound: boolean;
    readonly duration: UInt;

    constructor(json: PeerStatJSON) {
        this.name = json.name;
        this.bestBlockID = BlockId.of(json.bestBlockID);
        this.totalScore = UInt.of(json.totalScore);
        this.peerID = Hex.of(json.peerID);
        this.netAddr = NetAddr.of(json.netAddr);
        this.inbound = json.inbound;
        this.duration = UInt.of(json.duration);
    }

    toJSON(): PeerStatJSON {
        return {
            name: this.name,
            bestBlockID: this.bestBlockID.toString(),
            totalScore: this.totalScore.valueOf(),
            peerID: this.peerID.toString(),
            netAddr: this.netAddr.toString(),
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
