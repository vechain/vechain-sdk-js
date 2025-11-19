import { type SyncPollInputOptions } from './types';
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
declare function SyncPoll<TReturnType>(pollingFunction: () => Promise<TReturnType> | TReturnType, options?: SyncPollInputOptions): {
    waitUntil: (condition: (data: TReturnType) => boolean) => Promise<TReturnType>;
};
export { SyncPoll };
//# sourceMappingURL=sync.d.ts.map