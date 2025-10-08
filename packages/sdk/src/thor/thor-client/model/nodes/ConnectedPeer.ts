import { type Hex, type NetAddr } from '@common/vcdm';

/**
 * Represents a connected peer in the VeChainThor network.
 * This is the thor-client version that uses VCDM types.
 */
class ConnectedPeer {
    /** The name identifier of the peer */
    readonly name: string;

    /** The ID of the best block known to the peer */
    readonly bestBlockID: Hex;

    /** The total score of the peer */
    readonly totalScore: number;

    /** The unique identifier of the peer in hexadecimal format */
    readonly peerID: Hex;

    /** The network address of the peer */
    readonly netAddr: NetAddr;

    /** Indicates whether the peer connection is inbound */
    readonly inbound: boolean;

    /** The duration of the peer connection */
    readonly duration: number;

    /**
     * Constructs a new ConnectedPeer instance.
     *
     * @param data - Object containing the peer's statistics and details
     */
    constructor(data: {
        name: string;
        bestBlockID: Hex;
        totalScore: number;
        peerID: Hex;
        netAddr: NetAddr;
        inbound: boolean;
        duration: number;
    }) {
        this.name = data.name;
        this.bestBlockID = data.bestBlockID;
        this.totalScore = data.totalScore;
        this.peerID = data.peerID;
        this.netAddr = data.netAddr;
        this.inbound = data.inbound;
        this.duration = data.duration;
    }

    /**
     * Creates a ConnectedPeer instance from a PeerStat (thor REST layer type).
     *
     * @param peerStat - The PeerStat instance from the thor REST layer
     * @returns A new ConnectedPeer instance
     */
    static fromPeerStat(peerStat: {
        name: string;
        bestBlockID: Hex;
        totalScore: number;
        peerID: Hex;
        netAddr: NetAddr;
        inbound: boolean;
        duration: number;
    }): ConnectedPeer {
        return new ConnectedPeer({
            name: peerStat.name,
            bestBlockID: peerStat.bestBlockID,
            totalScore: peerStat.totalScore,
            peerID: peerStat.peerID,
            netAddr: peerStat.netAddr,
            inbound: peerStat.inbound,
            duration: peerStat.duration
        });
    }
}

export { ConnectedPeer };
