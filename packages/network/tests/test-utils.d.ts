/**
 * Advance timers by the specified time and tick
 *
 * This utility function groups two coupled operations:
 * - Advance timers by the specified time in milliseconds
 * - Wait for the next tick (needed for promises to resolve)
 *
 * @param time - The time to advance in milliseconds
 */
declare const advanceTimersByTimeAndTick: (time: number) => Promise<void>;
declare const getSoloChainTag: () => Promise<number>;
/**
 * Retry helper for RPC calls that may fail due to connection issues
 *
 * This function wraps RPC calls with retry logic to handle temporary
 * connection issues that are common in CI environments with solo nodes.
 *
 * @param operation - The async operation to retry
 * @param maxAttempts - Maximum number of retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds between retries (default: 1000)
 * @returns The result of the operation
 */
declare const retryOperation: <T>(operation: () => Promise<T>, maxAttempts?: number, baseDelay?: number) => Promise<T>;
export { advanceTimersByTimeAndTick, retryOperation, getSoloChainTag };
//# sourceMappingURL=test-utils.d.ts.map