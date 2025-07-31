import { Hex, HexUInt32, NetAddr, UInt } from '@common/vcdm';
import { type PeerStatJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified Path
 */

const FQP = 'packages/sdk/src/thor/node/PeerStat.ts!';

/**
 * [PeerStats](http://localhost:8669/doc/stoplight-ui/#/schemas/PeerStats)
 *
 * Represents statistics for a peer in the network
 */
class PeerStat {
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
     * Constructs a new instance of the class using the given PeerStatJSON object.
     *
     * @param {PeerStatJSON} json - The JSON object containing the peer's statistics and details.
     * @throws {IllegalArgumentError} If there is a problem parsing the provided JSON object.
     */
    constructor(json: PeerStatJSON) {
        try {
            this.name = json.name;
            this.bestBlockID = HexUInt32.of(json.bestBlockID);
            this.totalScore = UInt.of(json.totalScore).valueOf();
            this.peerID = Hex.of(json.peerID);
            this.netAddr = NetAddr.of(json.netAddr);
            this.inbound = json.inbound;
            this.duration = UInt.of(json.duration).valueOf();
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: PeerStatJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the PeerStat instance to a JSON object
     * @returns {PeerStatJSON} A JSON representation of the peer statistics
     */
    toJSON(): PeerStatJSON {
        return {
            name: this.name,
            bestBlockID: this.bestBlockID.toString(),
            totalScore: this.totalScore,
            peerID: this.peerID.toString(),
            netAddr: this.netAddr.toString(),
            inbound: this.inbound,
            duration: this.duration
        };
    }
}

export { PeerStat };
