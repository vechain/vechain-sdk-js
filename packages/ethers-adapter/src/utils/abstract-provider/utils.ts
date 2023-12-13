import { dataUtils } from '@vechainfoundation/vechain-sdk-core';
import { buildError, FUNCTION } from '@vechainfoundation/vechain-sdk-errors';
import {
    type HardhatEthersProviderEvent,
    type ProviderEvent,
    type EventFilter
} from './types';

/**
 * Type guard for Promise.
 *
 * @param value - The value to check.
 */
function isPromise<T = unknown>(value: unknown): value is Promise<T> {
    return (
        Boolean(value) &&
        value?.then !== undefined &&
        value.then !== null &&
        typeof value.then === 'function'
    );
}

/**
 * Sorts and removes duplicates from an array of strings.
 *
 * @param items - The array of strings to be sorted and de-duplicated.
 * @returns The sorted and de-duplicated array of strings.
 */
function concisify(items: string[]): string[] {
    items = Array.from(new Set(items).values());
    items.sort();
    return items;
}

/**
 * Checks whether the provided string is a valid transaction hash.
 *
 * @param x - The string to check.
 */
function isTransactionHash(x: string): boolean {
    return x.startsWith('0x') && dataUtils.isThorId(x, true);
}

/**
 * Type guard for EventFilter.
 *
 * @param x - The value to check.
 */
function isEventFilter(x: ProviderEvent): x is EventFilter {
    if (typeof x !== 'string' && !Array.isArray(x) && !('orphan' in x)) {
        return true;
    }

    return false;
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
