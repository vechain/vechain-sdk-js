import { type BlockSubscriptionOptions } from './types';
/**
 * Returns the URL for subscribing to new beats through a websocket connection.
 * @note This subscribes to the legacy beats.
 * [Legacy Beat source code](https://github.com/vechain/thor/blob/abf1da466b554dcc9c1ad30cb8e75a860b046bf5/api/subscriptions/beat_reader.go#L29)
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @param options - (optional) other optional parameters for the request.
 *                  `blockID` - The block id to start from, defaults to the best block.
 *
 * @returns The websocket subscription URL.
 */
declare const getLegacyBeatSubscriptionUrl: (baseURL: string, options?: BlockSubscriptionOptions) => string;
/**
 * Returns the URL for subscribing to new beats through a websocket connection.
 * @note this subscribes to the updated version of the beats. The new version uses a dynamic size bloom filter.
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @param options - (optional) other optional parameters for the request.
 *                 `blockID` - The block id to start from, defaults to the best block.
 *
 * @returns The websocket subscription URL.
 */
declare const getBeatSubscriptionUrl: (baseURL: string, options?: BlockSubscriptionOptions) => string;
export { getLegacyBeatSubscriptionUrl, getBeatSubscriptionUrl };
//# sourceMappingURL=beat.d.ts.map