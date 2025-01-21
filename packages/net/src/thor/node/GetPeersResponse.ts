import { PeerStat, type PeerStatJSON } from './PeerStat';

class GetPeersResponse extends Array<PeerStat> {
    constructor(json: GetPeersResponseJSON) {
        console.warn('JSON: ', json);
        super(...json.map((json: PeerStatJSON) => new PeerStat(json)));
    }

    toJSON(): GetPeersResponseJSON {
        return this.map((peerStat: PeerStat) => peerStat.toJSON());
    }
}

interface GetPeersResponseJSON extends Array<PeerStatJSON> {}

export { GetPeersResponse, type GetPeersResponseJSON };
