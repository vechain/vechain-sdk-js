import { type SyncPollInputOptions } from './types';
import { InvalidDataType, PollExecution } from '@vechain/sdk-errors';

/**
 * Sleep for a given amount of time (in milliseconds).
 *
 * @param delayInMilliseconds - The amount of time to sleep in milliseconds.
 */
async function sleep(delayInMilliseconds: number): Promise<void> {
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
function SyncPoll<TReturnType>(
    pollingFunction: () => Promise<TReturnType> | TReturnType,
    options?: SyncPollInputOptions
): {
    waitUntil: (
        condition: (data: TReturnType) => boolean
    ) => Promise<TReturnType>;
} {
    // Positive number for the request interval
    if (
        options?.requestIntervalInMilliseconds !== undefined &&
        (options.requestIntervalInMilliseconds <= 0 ||
            !Number.isInteger(options.requestIntervalInMilliseconds))
    ) {
        throw new InvalidDataType(
            'SyncPoll()',
            'Polling failed: Invalid input for field "options?.requestIntervalInMilliseconds" it must be a positive number',
            {
                requestIntervalInMilliseconds:
                    options.requestIntervalInMilliseconds
            }
        );
    }

    // Positive number for maximum iterations
    if (
        options?.maximumIterations !== undefined &&
        (options.maximumIterations <= 0 ||
            !Number.isInteger(options.maximumIterations))
    ) {
        throw new InvalidDataType(
            'SyncPoll()',
            'Polling failed: Invalid input for field "options?.maximumIterations" it must be a positive number',
            {
                maximumIterations: options.maximumIterations
            }
        );
    }

    // Positive number for maximum waiting time
    if (
        options?.maximumWaitingTimeInMilliseconds !== undefined &&
        (options.maximumWaitingTimeInMilliseconds <= 0 ||
            !Number.isInteger(options.maximumWaitingTimeInMilliseconds))
    ) {
        throw new InvalidDataType(
            'SyncPoll()',
            'Polling failed: Invalid input for field "options?.maximumWaitingTimeInMilliseconds" it must be a positive number',
            {
                maximumWaitingTimeInMilliseconds:
                    options.maximumWaitingTimeInMilliseconds
            }
        );
    }

    // Number of iterations
    let currentIteration = 0;

    // Current result
    let currentResult: TReturnType;

    // Polling condition
    let pollingCondition: boolean = false;

    // Initialize the start time
    const startTime = Date.now();

    return {
        /**
         * Poll until the condition is met.
         *
         * @param condition - The condition to be met.
         * @returns The result of the poll after the condition is met.
         */
        waitUntil: async (
            condition: (data: TReturnType) => boolean
        ): Promise<TReturnType> => {
            try {
                do {
                    // 1 - Fetch the result of promise
                    currentResult = await pollingFunction();

                    // 2 - Sleep for the interval (in a synchronous way)
                    await sleep(
                        options?.requestIntervalInMilliseconds !== undefined
                            ? options.requestIntervalInMilliseconds
                            : 1000
                    );

                    // 3 - Increment the current iteration
                    currentIteration = currentIteration + 1;

                    // 4 - Check if the poll should be stopped (in a forced way OR not)
                    // 4.1 - If the condition is met or not
                    const isConditionSatisfied = condition(currentResult);

                    // 4.2 - Stop forced on iterations
                    const isMaximumIterationsReached =
                        options?.maximumIterations !== undefined
                            ? currentIteration >= options.maximumIterations
                            : false;

                    // 4.3 - Stop forced on maximum waiting time
                    const isTimeLimitReached =
                        options?.maximumWaitingTimeInMilliseconds !==
                            undefined &&
                        Date.now() - startTime >=
                            options.maximumWaitingTimeInMilliseconds;

                    // Stop the polling if the condition is met OR the maximum iterations is reached OR the maximum waiting time is reached
                    pollingCondition = !(
                        isConditionSatisfied ||
                        isMaximumIterationsReached ||
                        isTimeLimitReached
                    );
                } while (pollingCondition);

                return currentResult;
            } catch (error) {
                throw new PollExecution(
                    'SyncPoll.waitUntil()',
                    'Polling failed: Function execution error encountered during synchronous polling.',
                    {
                        functionName: pollingFunction.name
                    },
                    error
                );
            }
        }
    };
}

export { SyncPoll };
