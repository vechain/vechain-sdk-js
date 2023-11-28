/**
 * Options for the force stop of the sync polling.
 */
interface SyncPollInputOptions {
    /**
     * The maximum number of iterations.
     * Poll will stop after this number of iterations, no matter condition is met or not.
     *
     * @note If not specified limit on iterations is NOT given.
     */
    maximumIterations?: number;

    /**
     * The interval of time (in milliseconds) between each function call.
     *
     * @note If not specified a default value is given.
     */
    requestIntervalInMilliseconds?: number;
}

export { type SyncPollInputOptions };
