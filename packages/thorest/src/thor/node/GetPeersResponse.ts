import { PeerStat, type PeerStatJSON } from './PeerStat';

class GetPeersResponse extends Array<PeerStat> {
    constructor(json: GetPeersResponseJSON) {
        super(...json.map((json: PeerStatJSON) => new PeerStat(json)));
    }
}

interface GetPeersResponseJSON extends Array<PeerStatJSON> {}

export { GetPeersResponse, type GetPeersResponseJSON };
