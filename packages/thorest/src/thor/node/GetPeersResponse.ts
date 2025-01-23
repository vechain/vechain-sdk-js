import { PeerStat, type PeerStatJSON } from './PeerStat';

/**
 * Represents a response containing an array of PeerStat objects.
 * Extends the native Array class to provide specialized handling of PeerStat objects.
 * @extends Array<PeerStat>
 */
class GetPeersResponse extends Array<PeerStat> {
    /**
     * Creates a new GetPeersResponse instance.
     * Special constructor pattern required for Array inheritance.
     * Array constructor is first called with a length parameter,
     * so we need this pattern to properly handle array data instead.
     *
     * @param json - The JSON array containing peer statistics data
     * @returns A new GetPeersResponse instance containing PeerStat objects
     */
    constructor(json: GetPeersResponseJSON) {
        super();
        return Object.setPrototypeOf(
            Array.from(json ?? [], (peerStat) => {
                return new PeerStat(peerStat);
            }),
            GetPeersResponse.prototype
        ) as GetPeersResponse;
    }

    /**
     * Converts the GetPeersResponse instance to a JSON array
     * @returns {GetPeersResponseJSON} An array of peer statistics in JSON format
     */
    toJSON(): GetPeersResponseJSON {
        return this.map((peerStat: PeerStat) => peerStat.toJSON());
    }
}

/**
 * Interface representing the JSON structure of the peers response.
 * Extends the native Array type to contain PeerStatJSON objects.
 * @extends Array<PeerStatJSON>
 */
interface GetPeersResponseJSON extends Array<PeerStatJSON> {}

export { GetPeersResponse, type GetPeersResponseJSON };
