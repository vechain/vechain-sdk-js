import { jest } from '@jest/globals';

/**
 * Advance timers by the specified time and tick
 *
 * This utility function groups two coupled operations:
 * - Advance timers by the specified time in milliseconds
 * - Wait for the next tick (needed for promises to resolve)
 *
 * @param time - The time to advance in milliseconds
 */
const advanceTimersByTimeAndTick = async (time: number): Promise<void> => {
    jest.advanceTimersByTime(time);
    await new Promise<void>((resolve) => {
        process.nextTick(resolve);
    });
};

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
const retryOperation = async <T>(
    operation: () => Promise<T>,
    maxAttempts = 3,
    baseDelay = 1000
): Promise<T> => {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError =
                error instanceof Error ? error : new Error(String(error));

            // Check if it's a connection error
            const errorMessage = lastError.message;
            const isConnectionError =
                errorMessage.includes('socket hang up') ||
                errorMessage.includes('ECONNRESET') ||
                errorMessage.includes('connect ETIMEDOUT') ||
                errorMessage.includes('request failed');

            // If it's not a connection error or this is the last attempt, throw
            if (!isConnectionError || attempt === maxAttempts) {
                throw lastError;
            }

            // Wait before retrying with exponential backoff
            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    // This should never be reached, but TypeScript requires it
    throw lastError;
};

export { advanceTimersByTimeAndTick, retryOperation };
