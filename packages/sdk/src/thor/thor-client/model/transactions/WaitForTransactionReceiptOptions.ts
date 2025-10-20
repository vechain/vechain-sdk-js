/**
 * Options for waiting for a transaction receipt.
 */
interface WaitForTransactionReceiptOptions {
    /**
     * The interval in milliseconds between polling attempts.
     * Defaults to 1000 ms if not specified.
     */
    intervalMs?: number;
    /**
     * Timeout in milliseconds
     */
    timeoutMs?: number;
}

export { type WaitForTransactionReceiptOptions };
