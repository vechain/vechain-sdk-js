import { type EventLike, type EventSubscriptionOptions } from './types';
/**
 * Returns the URL for subscribing to an event through a websocket connection.
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @param event - The event to subscribe to.
 *                Can be an event object or a string representing an event.
 *                @see [Viem Parse ABI Item](https://viem.sh/docs/abi/parseAbiItem.html)
 *
 * @param indexedValues - The values of the indexed parameters to construct the topic filters.
 * @param options - (optional) other optional parameters for the request.
 *                  `blockID` - The block id to start from, defaults to the best block.
 *                  `address` - The contract address to filter events by.
 *
 * @returns The websocket subscription URL.
 *
 * @throws Will throw an error if the event is not a valid event or if the indexed values to encode are invalid.
 */
declare const getEventSubscriptionUrl: (baseURL: string, event: EventLike, indexedValues?: unknown[], options?: EventSubscriptionOptions) => string;
export { getEventSubscriptionUrl };
//# sourceMappingURL=event.d.ts.map