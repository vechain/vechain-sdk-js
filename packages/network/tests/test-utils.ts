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
    await new Promise((resolve) => {
        if (typeof process !== 'undefined' && process.nextTick) {
            process.nextTick(resolve);
        } else {
            setTimeout(resolve, 0);
        }
    });
};

export { advanceTimersByTimeAndTick };
