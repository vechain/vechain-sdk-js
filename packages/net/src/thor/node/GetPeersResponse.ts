import { PeerStat, type PeerStatJSON } from './PeerStat';

class GetPeersResponse extends Array<PeerStat> {
    /**
     * Special constructor pattern required for Array inheritance.
     * Array constructor is first called with a length parameter,
     * so we need this pattern to properly handle array data instead.
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

    toJSON(): GetPeersResponseJSON {
        return this.map((peerStat: PeerStat) => peerStat.toJSON());
    }
}

interface GetPeersResponseJSON extends Array<PeerStatJSON> {}

export { GetPeersResponse, type GetPeersResponseJSON };
