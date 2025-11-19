"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPoll = SyncPoll;
const sdk_errors_1 = require("@vechain/sdk-errors");
const MAX_SAFE_ITERATIONS = 1000;
/**
 * Sleep for a given amount of time (in milliseconds).
 *
 * @param delayInMilliseconds - The amount of time to sleep in milliseconds.
 */
async function sleep(delayInMilliseconds) {
    await new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
}
/**
 * Poll until the condition is met.
 *
 * @note: Be careful!, this function is synchronous and will block the thread until the condition is met.
 * Thus mean it can run forever if the condition is never met.
 * To avoid infinite loop, you can use the `options.maximumIterations` parameter.
 *
 * @example It can be used to wait until:
 *  - A balance is updated after a transaction is sent
 *  - A transaction is mined
 *  - A block is mined
 *  ...
 *
 * @param pollingFunction - The function to be called.
 * @param options - Polling options. @see {SyncPollInputOptions} type. If not specified, the default values are used. In particular: `requestIntervalInMilliseconds` is 1000, `maximumIterations` is not specified
 *                  and `maximumWaitingTimeInMilliseconds` is not specified.
 * @returns An object with a `waitUntil` method. It blocks execution until the condition is met. When the condition is met, it returns the result of the poll.
 * @throws {InvalidDataType, PollExecution}
 */
function SyncPoll(pollingFunction, options) {
    // Positive number for the request interval
    if (options?.requestIntervalInMilliseconds !== undefined &&
        (options.requestIntervalInMilliseconds <= 0 ||
            !Number.isInteger(options.requestIntervalInMilliseconds))) {
        throw new sdk_errors_1.InvalidDataType('SyncPoll()', 'Polling failed: Invalid input for field "options?.requestIntervalInMilliseconds" it must be a positive number', {
            requestIntervalInMilliseconds: options.requestIntervalInMilliseconds
        });
    }
    // Positive number for maximum iterations
    if (options?.maximumIterations !== undefined &&
        (options.maximumIterations <= 0 ||
            !Number.isInteger(options.maximumIterations))) {
        throw new sdk_errors_1.InvalidDataType('SyncPoll()', 'Polling failed: Invalid input for field "options?.maximumIterations" it must be a positive number', {
            maximumIterations: options.maximumIterations
        });
    }
    // Positive number for maximum waiting time
    if (options?.maximumWaitingTimeInMilliseconds !== undefined &&
        (options.maximumWaitingTimeInMilliseconds <= 0 ||
            !Number.isInteger(options.maximumWaitingTimeInMilliseconds))) {
        throw new sdk_errors_1.InvalidDataType('SyncPoll()', 'Polling failed: Invalid input for field "options?.maximumWaitingTimeInMilliseconds" it must be a positive number', {
            maximumWaitingTimeInMilliseconds: options.maximumWaitingTimeInMilliseconds
        });
    }
    // Number of iterations
    let currentIteration = 0;
    // Current result
    let currentResult;
    // Polling condition
    let pollingCondition = false;
    // Initialize the start time
    const startTime = Date.now();
    return {
        /**
         * Poll until the condition is met.
         *
         * @param condition - The condition to be met.
         * @returns The result of the poll after the condition is met.
         */
        waitUntil: async (condition) => {
            let consecutiveNetworkErrors = 0;
            const maxConsecutiveNetworkErrors = 10;
            let isConditionSatisfied = false;
            try {
                do {
                    try {
                        // 1 - Fetch the result of promise
                        currentResult = await pollingFunction();
                        consecutiveNetworkErrors = 0;
                        isConditionSatisfied = condition(currentResult);
                        if (isConditionSatisfied) {
                            // If the condition is satisfied, return the current result
                            return currentResult;
                        }
                    }
                    catch (error) {
                        if (error instanceof sdk_errors_1.HttpNetworkError) {
                            consecutiveNetworkErrors++;
                            if (consecutiveNetworkErrors >=
                                maxConsecutiveNetworkErrors) {
                                throw new sdk_errors_1.PollExecution('SyncPoll.waitUntil()', 'Polling failed: Too many consecutive network errors.', {
                                    functionName: pollingFunction.name
                                }, error);
                            }
                            // Continue polling for network errors without incrementing iteration
                            await sleep(options?.requestIntervalInMilliseconds ?? 1000);
                            continue;
                        }
                        else {
                            // Re-throw non-network errors immediately
                            throw error;
                        }
                    }
                    // 2 - Sleep for the interval (in a synchronous way)
                    await sleep(options?.requestIntervalInMilliseconds ?? 1000);
                    // 3 - Increment the current iteration
                    currentIteration = currentIteration + 1;
                    // 4.1 - Stop forced on iterations
                    const isMaximumIterationsReached = options?.maximumIterations !== undefined
                        ? currentIteration >= options.maximumIterations
                        : currentIteration >= MAX_SAFE_ITERATIONS;
                    // 4.2 - Stop forced on maximum waiting time
                    const isTimeLimitReached = options?.maximumWaitingTimeInMilliseconds !==
                        undefined &&
                        Date.now() - startTime >=
                            options.maximumWaitingTimeInMilliseconds;
                    // Stop the polling if the condition is met OR the maximum iterations is reached OR the maximum waiting time is reached
                    pollingCondition = !(isConditionSatisfied ||
                        isMaximumIterationsReached ||
                        isTimeLimitReached);
                    // Additional safety check for maximum iterations
                    if (currentIteration >= MAX_SAFE_ITERATIONS) {
                        throw new sdk_errors_1.PollExecution('SyncPoll.waitUntil()', 'Polling failed: Maximum safe iterations reached.', {
                            functionName: pollingFunction.name
                        });
                    }
                } while (pollingCondition);
                return currentResult;
            }
            catch (error) {
                throw new sdk_errors_1.PollExecution('SyncPoll.waitUntil()', 'Polling failed: Function execution error encountered during synchronous polling.', {
                    functionName: pollingFunction.name
                }, error);
            }
        }
    };
}
