import { PeerStat } from '@thor/thorest/node/model';
import { type GetPeersResponseJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/thorest/node/response/GetPeersResponse.ts!';

/**
 * [GetPeersResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetPeersResponse)
 *
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
     * @throws IllegalArgumentError If there is a problem parsing the provided JSON object.
     */
    constructor(json: GetPeersResponseJSON) {
        super();
        try {
            return Object.setPrototypeOf(
                Array.from(json ?? [], (peerStat) => {
                    return new PeerStat(peerStat);
                }),
                GetPeersResponse.prototype
            ) as GetPeersResponse;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: GetPeerResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the GetPeersResponse instance to a JSON array
     * @returns {GetPeersResponseJSON} An array of peer statistics in JSON format
     */
    toJSON(): GetPeersResponseJSON {
        return this.map((peerStat: PeerStat) =>
            peerStat.toJSON()
        ) satisfies GetPeersResponseJSON;
    }
}

export { GetPeersResponse };
