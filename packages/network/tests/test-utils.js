"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoloChainTag = exports.retryOperation = exports.advanceTimersByTimeAndTick = void 0;
const globals_1 = require("@jest/globals");
const src_1 = require("../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Advance timers by the specified time and tick
 *
 * This utility function groups two coupled operations:
 * - Advance timers by the specified time in milliseconds
 * - Wait for the next tick (needed for promises to resolve)
 *
 * @param time - The time to advance in milliseconds
 */
const advanceTimersByTimeAndTick = async (time) => {
    globals_1.jest.advanceTimersByTime(time);
    await new Promise((resolve) => {
        process.nextTick(resolve);
    });
};
exports.advanceTimersByTimeAndTick = advanceTimersByTimeAndTick;
const getSoloChainTag = async () => {
    const thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    const chainTag = await thorClient.nodes.getChaintag();
    return chainTag;
};
exports.getSoloChainTag = getSoloChainTag;
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
const retryOperation = async (operation, maxAttempts = 3, baseDelay = 1000) => {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError =
                error instanceof Error ? error : new Error(String(error));
            // Check if it's a network communication error
            const isNetworkError = lastError instanceof sdk_errors_1.HttpNetworkError;
            // If it's not a network error or this is the last attempt, throw
            if (!isNetworkError || attempt === maxAttempts) {
                throw lastError ?? new Error('Unknown error');
            }
            // Wait before retrying with exponential backoff
            const delay = baseDelay * Math.pow(2, attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    // This should never be reached, but TypeScript requires it
    throw lastError ?? new Error('Unknown error');
};
exports.retryOperation = retryOperation;
