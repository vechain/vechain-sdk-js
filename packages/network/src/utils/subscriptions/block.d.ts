import { type BlockSubscriptionOptions } from './types';
/**
 * Returns the URL for subscribing to new blocks through a websocket connection.
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @param options - (optional) other optional parameters for the request.
 *                 `blockID` - The block id to start from, defaults to the best block.
 *
 * @returns The websocket subscription URL.
 */
declare const getBlockSubscriptionUrl: (baseURL: string, options?: BlockSubscriptionOptions) => string;
export { getBlockSubscriptionUrl };
//# sourceMappingURL=block.d.ts.map