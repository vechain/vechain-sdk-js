import { sleep } from './common';

/**
 * Poll until the condition is met.
 *
 * @note: Be careful, this function is synchronous and will block the thread until the condition is met.
 * Thus mean it can run forever if the condition is never met.
 *
 * @example It can be used to wait until:
 *  - A balance is updated after a transaction is send
 *  - A transaction is mined
 *  - A block is mined
 *  ...
 *
 * @param callBack - The function to be called.
 * @param requestIntervalInMilliseconds - The interval of time (in milliseconds) between each request.
 * @returns An object with a `waitUntil` method. It blocks execution until the condition is met. When the condition is met, it returns the result of the poll.
 */
function syncPoll<TReturnType>(
    callBack: () => Promise<TReturnType>,
    requestIntervalInMilliseconds: number
): {
    waitUntil: (
        condition: (data: TReturnType) => boolean
    ) => Promise<TReturnType>;
} {
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
            let result: TReturnType;
            do {
                // Fetch the result of promise
                result = await callBack();

                // Sleep for the interval
                await sleep(requestIntervalInMilliseconds);
            } while (!condition(result));

            return result;
        }
    };
}

export { syncPoll };
