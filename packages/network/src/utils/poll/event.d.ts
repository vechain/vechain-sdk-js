import { EventEmitter } from 'events';
/**
 * Poll in an event based way.
 * This Poll is Asynchronous. It exploits:
 * - The EventEmitter to emit events
 * - The setInterval function to poll
 *
 * @example It can be used to trigger events every time
 *  - When balance is updated after a transaction is sent a message is sent
 *  - When a transaction is mined a message is sent
 *  - When a certain block is mined an operation can start
 *  ...
 */
declare class EventPoll<TReturnType> extends EventEmitter {
    /**
     * The current iteration. It counts how many iterations have been done.
     * This parameter is useful to know how many iterations have been done.
     * For example, it can be used to stop the poll after a certain number of iterations.
     */
    private currentIteration;
    /**
     * Error thrown during the execution of the poll.
     */
    private error?;
    /**
     * Indicates whether to stop execution on error of the
     * {@link _intervalLoop} function.
     *
     * @type {boolean}
     */
    private readonly hasToStopOnError;
    /**
     * The interval used to poll.
     */
    private intervalId?;
    /**
     * The function to be called.
     */
    private readonly pollingFunction;
    /**
     * The interval of time (in milliseconds) between each request.
     */
    private readonly requestIntervalInMilliseconds;
    /**
     * Constructor for creating an instance of EventPoll.
     *
     * @param {Function} pollingFunction - The function to be executed repeatedly.
     * @param {number} requestIntervalInMilliseconds - The interval in milliseconds between each execution of the polling function.
     * @param {boolean} [hasToStopOnError=true] - Indicates whether to stop polling if an error occurs.
     * @throws {InvalidDataType}
     */
    constructor(pollingFunction: () => Promise<TReturnType>, requestIntervalInMilliseconds: number, hasToStopOnError: boolean);
    /**
     * Get how many iterations have been done.
     *
     * @returns The number of iterations.
     */
    get getCurrentIteration(): number;
    /**
     * Basic interval loop function.
     * This function must be called into setInterval.
     * It calls the promise and emit the event.
     */
    private _intervalLoop;
    /**
     * Listen to the 'data' event.
     * This method is the redefinition of the EventEmitter.on method.
     * Because the EventEmitter.on method does not allow to specify the type of the data.
     * And we must be type safe.
     *
     * This is equivalent to:
     *
     * ```typescript
     * eventPoll.on('data', (data) => { ... });
     * ```
     * @param onDataCallback - The callback to be called when the event is emitted.
     */
    onData(onDataCallback: (data: TReturnType, eventPoll: EventPoll<TReturnType>) => void): this;
    /**
     * Listen to the 'error' event.
     * This method is the redefinition of the EventEmitter.on method.
     * Because the EventEmitter.on method does not allow to specify the type of the data.
     * And we must be type safe.
     *
     * This is equivalent to:
     *
     * ```typescript
     * eventPoll.on('error', (data) => { ... });
     * ```
     * @param onErrorCallback - The callback to be called when the event is emitted.
     */
    onError(onErrorCallback: (error: Error) => void): this;
    /**
     * Listen to the 'start' event.
     * This happens when the poll is stopped.
     *
     * @param onStartCallback - The callback to be called when the event is emitted.
     */
    onStart(onStartCallback: (eventPoll: EventPoll<TReturnType>) => void): this;
    /**
     * Listen to the 'stop' event.
     * This happens when the poll is stopped.
     *
     * @param onStopCallback - The callback to be called when the event is emitted.
     */
    onStop(onStopCallback: (eventPoll: EventPoll<TReturnType>) => void): this;
    /**
     * Start listening to the event.
     */
    startListen(): void;
    /**
     * Stop listening to the event.
     */
    stopListen(): void;
}
/**
 * Creates an event poll that performs a callback function repeatedly at a specified interval.
 * This method is useful to create an event poll in a more readable way.
 *
 * @param {Function} callBack - The callback function to be executed on each interval. It should return a Promise.
 * @param {number} requestIntervalInMilliseconds - The interval in milliseconds at which the callback function will be executed.
 * @param {boolean} [hasToStopOnError=true] - Optional parameter to specify whether the poll should stop on error. Default is true.
 * @returns {EventPoll} - The created event poll instance.
 */
declare function createEventPoll<TReturnType>(callBack: () => Promise<TReturnType>, requestIntervalInMilliseconds: number, hasToStopOnError?: boolean): EventPoll<TReturnType>;
export { EventPoll, createEventPoll };
//# sourceMappingURL=event.d.ts.map