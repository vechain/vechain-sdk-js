/**
 * [PeerStatJSON](http://localhost:8669/doc/stoplight-ui/#/schemas/PeerStats)
 *
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

export { type PeerStatJSON };
