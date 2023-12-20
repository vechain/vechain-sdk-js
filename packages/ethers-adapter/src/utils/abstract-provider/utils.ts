import { dataUtils } from '@vechainfoundation/vechain-sdk-core';

import { buildError, FUNCTION } from '@vechainfoundation/vechain-sdk-errors';
import {
    type EventFilter,
    type HardhatEthersProviderEvent,
    type ProviderEvent
} from './types';

/**
 * Type guard for Promise.
 *
 * When ethers registers an event with an async value (e.g. address is a Signer or ENS name)
 * ethers need to add it immediately for the Event API,
 *
 * @param value - The value to check.
 */
function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
    return (
        value !== undefined &&
        value !== null &&
        (value as Promise<T>).then !== undefined &&
        typeof (value as Promise<T>).then === 'function'
    );
}

/**
 * Sorts and removes duplicates from an array of strings.
 *
 * Useful for de-duplicating event names.
 *
 * @param items - The array of strings to be sorted and de-duplicated.
 * @returns The sorted and de-duplicated array of strings.
 */
function concisify(items: string[]): string[] {
    items = Array.from(new Set(items).values());
    items.sort((a, b) => a.localeCompare(b));
    return items;
}

/**
 * Checks whether the provided string is a valid transaction hash.
 *
 * Useful for checking during `ethersToHardhatEvent` function call
 *
 * @param x - The string to check.
 */
function isTransactionHash(x: string): boolean {
    return dataUtils.isThorId(x, true);
}

/**
 * Type guard for EventFilter.
 *
 * Useful for checking during `ethersToHardhatEvent` function call
 *
 * @param x - The value to check.
 */
function isEventFilter(x: ProviderEvent): x is EventFilter {
    return typeof x !== 'string' && !Array.isArray(x) && !('orphan' in x);
}

/**
 * Converts an ethers.js event to a HardhatEthersProviderEvent.
 *
 * @param event - The ethers.js event to convert.
 */
function ethersToHardhatEvent(
    event: ProviderEvent
): HardhatEthersProviderEvent {
    throw buildError(FUNCTION.NOT_IMPLEMENTED, 'Function not implemented.', {
        event
    });
}

export {
    isPromise,
    isEventFilter,
    concisify,
    isTransactionHash,
    ethersToHardhatEvent
};
