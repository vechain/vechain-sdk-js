import { BlockId } from '@vechain/sdk-core';

import { UInt } from '../../../../core/src/vcdm/UInt';
import { Hex } from '../../../../core/src/vcdm/Hex';
import { NetAddr } from '@vechain/sdk-core/src/vcdm/NetAddr';

/**
 * Represents statistics for a peer in the network
 */
class PeerStat {
    /** The name identifier of the peer */
    readonly name: string;

    /** The ID of the best block known to the peer */
    readonly bestBlockID: BlockId;

    /** The total score of the peer */
    readonly totalScore: UInt;

    /** The unique identifier of the peer in hexadecimal format */
    readonly peerID: Hex;

    /** The network address of the peer */
    readonly netAddr: NetAddr;

    /** Indicates whether the peer connection is inbound */
    readonly inbound: boolean;

    /** The duration of the peer connection */
    readonly duration: UInt;

    /**
     * Creates a new PeerStat instance
     * @param json - The JSON object containing peer statistics
     */
    constructor(json: PeerStatJSON) {
        this.name = json.name;
        this.bestBlockID = BlockId.of(json.bestBlockID);
        this.totalScore = UInt.of(json.totalScore);
        this.peerID = Hex.of(json.peerID);
        this.netAddr = NetAddr.of(json.netAddr);
        this.inbound = json.inbound;
        this.duration = UInt.of(json.duration);
    }

    /**
     * Converts the PeerStat instance to a JSON object
     * @returns {PeerStatJSON} A JSON representation of the peer statistics
     */
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

/**
 * Interface representing the JSON structure of peer statistics
 */
interface PeerStatJSON {
    /** The name identifier of the peer */
    name: string;

    /** The ID of the best block known to the peer as a string */
    bestBlockID: string;

    /** The total score of the peer as a number */
    totalScore: number;

    /** The peer ID in string format */
    peerID: string;

    /** The network address as a string */
    netAddr: string;

    /** Indicates whether the peer connection is inbound */
    inbound: boolean;

    /** The duration of the peer connection as a number */
    duration: number;
}

export { PeerStat, type PeerStatJSON };
