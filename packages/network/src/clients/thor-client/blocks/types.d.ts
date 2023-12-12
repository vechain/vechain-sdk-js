/* --- Input options start --- */

/**
 * Options for `waitForBlock` method.
 */
interface WaitForBlockOptions {
    /**
     * Timeout in milliseconds.
     * After this time, the method will throw an error.
     */
    timeoutMs?: number;
    /**
     * Interval in milliseconds.
     * The method will check the blocks status every `intervalMs` milliseconds.
     */
    intervalMs?: number;
}

/* --- Input options end --- */

export type { WaitForBlockOptions };
