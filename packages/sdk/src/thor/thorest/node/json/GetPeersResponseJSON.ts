import type { PeerStatJSON } from '@thor/thorest/json';

/**
 * [GetPeersResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetPeersResponse)
 *
 * Interface representing the JSON structure of the peers response.
 * Extends the native Array type to contain PeerStatJSON objects.
 * @extends Array<PeerStatJSON>
 */
interface GetPeersResponseJSON extends Array<PeerStatJSON> {}

export { type GetPeersResponseJSON };
