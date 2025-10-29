/**
 * Options for waiting for a transaction receipt.
 */
interface WaitForTransactionReceiptOptions {
    /**
     * The interval in milliseconds between polling attempts.
     * Defaults to 1 second if not specified.
     */
    intervalMs?: number;
    /**
     * Timeout in milliseconds, defaults to 30 seconds if not specified.
     */
    timeoutMs?: number;
}

export { type WaitForTransactionReceiptOptions };
