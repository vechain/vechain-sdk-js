import { ABIEvent } from '@vechain/sdk-core';
import { type AbiEvent } from 'abitype';
import { thorest } from '../thorest';
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
const getEventSubscriptionUrl = (
    baseURL: string,
    event: EventLike,
    indexedValues?: unknown[],
    options?: EventSubscriptionOptions
): string => {
    const ev =
        typeof event === 'string'
            ? new ABIEvent(event)
            : new ABIEvent(event as AbiEvent);

    // Encode the indexed parameters to construct the topic filters
    const encodedTopics = ev.encodeFilterTopicsNoNull(indexedValues ?? []);

    return thorest.subscriptions.get.EVENT(baseURL, {
        position: options?.blockID,
        contractAddress: options?.address,
        topic0: encodedTopics[0],
        topic1: encodedTopics[1],
        topic2: encodedTopics[2],
        topic3: encodedTopics[3],
        topic4: encodedTopics[4]
    });
};

export { getEventSubscriptionUrl };
