import { type SyncPollInputOptions } from './types';
import {
    assert,
    DATA,
    buildError,
    POLL_ERROR
} from '@vechainfoundation/vechain-sdk-errors';

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
 *  - A balance is updated after a transaction is send
 *  - A transaction is mined
 *  - A block is mined
 *  ...
 *
 * @param pollingFunction - The function to be called.
 * @param options - Polling options. @see{SyncPollInputOptions} type. If not specified, the default values are used. In particular: `requestIntervalInMilliseconds` is 1000 and `maximumIterations` is not specified.
 * @returns An object with a `waitUntil` method. It blocks execution until the condition is met. When the condition is met, it returns the result of the poll.
 */
function SyncPoll<TReturnType>(
    pollingFunction: () => Promise<TReturnType>,
    options?: SyncPollInputOptions
): {
    waitUntil: (
        condition: (data: TReturnType) => boolean
    ) => Promise<TReturnType>;
} {
    // Positive number for request interval
    assert(
        options?.requestIntervalInMilliseconds === undefined ||
            (options?.requestIntervalInMilliseconds > 0 &&
                Number.isInteger(options?.requestIntervalInMilliseconds)),
        DATA.INVALID_DATA_TYPE,
        'options.requestIntervalInMilliseconds must be a positive number',
        { options }
    );

    // Positive number for maximum iterations
    assert(
        options?.maximumIterations === undefined ||
            (options?.maximumIterations > 0 &&
                Number.isInteger(options?.maximumIterations)),
        DATA.INVALID_DATA_TYPE,
        'options.maximumIterations must be a positive number',
        { options }
    );

    // Number of iterations
    let currentIteration = 0;

    // Current result
    let currentResult: TReturnType;

    // Polling condition
    let pollingCondition: boolean = false;

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
                    const notConditionSatisfied = !condition(currentResult);

                    // 4.2 - Stop forced on iterations
                    const mustStopForcedOnIterations =
                        options?.maximumIterations !== undefined
                            ? currentIteration >= options.maximumIterations
                            : false;

                    pollingCondition =
                        notConditionSatisfied && !mustStopForcedOnIterations;
                } while (pollingCondition);

                return currentResult;
            } catch (error) {
                throw buildError(
                    POLL_ERROR.POOLL_EXECUTION_ERROR,
                    'Error on function execution',
                    { functionName: pollingFunction.name },
                    error
                );
            }
        }
    };
}

export { SyncPoll };
