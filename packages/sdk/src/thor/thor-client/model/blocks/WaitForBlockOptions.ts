/**
 * Options for `waitForBlock` and `waitForBlockExpanded` methods.
 */
interface WaitForBlockOptions {
    /**
     * Delay (ms) between successive block queries when polling.
     */
    intervalMs?: number;

    /**
     * Maximum time (ms) to wait before aborting the operation.
     */
    timeoutMs?: number;

    /**
     * Maximum consecutive network errors tolerated before failing.
     */
    maxNetworkErrors?: number;
}

export { type WaitForBlockOptions };
