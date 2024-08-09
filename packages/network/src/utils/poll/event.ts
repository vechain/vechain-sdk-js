import { EventEmitter } from 'events';
import { InvalidDataType, PollExecution } from '@vechain/sdk-errors';

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
class EventPoll<TReturnType> extends EventEmitter {
    /**
     * The current iteration. It counts how many iterations have been done.
     * This parameter is useful to know how many iterations have been done.
     * For example, it can be used to stop the poll after a certain number of iterations.
     */
    private currentIteration: number = 0;

    /**
     * Error thrown during the execution of the poll.
     */
    private error?: Error;

    /**
     * Indicates whether to stop execution on error of the
     * {@link _intervalLoop} function.
     *
     * @type {boolean}
     */
    private readonly hasToStopOnError: boolean;

    /**
     * The interval used to poll.
     */
    private intervalId?: NodeJS.Timeout;

    /**
     * The function to be called.
     */
    private readonly pollingFunction: () => Promise<TReturnType>;

    /**
     * The interval of time (in milliseconds) between each request.
     */
    private readonly requestIntervalInMilliseconds: number;

    /**
     * Constructor for creating an instance of EventPoll.
     *
     * @param {Function} pollingFunction - The function to be executed repeatedly.
     * @param {number} requestIntervalInMilliseconds - The interval in milliseconds between each execution of the polling function.
     * @param {boolean} [hasToStopOnError=true] - Indicates whether to stop polling if an error occurs.
     * @throws {InvalidDataType}
     */
    constructor(
        pollingFunction: () => Promise<TReturnType>,
        requestIntervalInMilliseconds: number,
        hasToStopOnError: boolean
    ) {
        super();
        this.pollingFunction = pollingFunction;
        this.hasToStopOnError = hasToStopOnError;

        // Positive number for request interval
        if (
            requestIntervalInMilliseconds !== undefined &&
            (requestIntervalInMilliseconds <= 0 ||
                !Number.isInteger(requestIntervalInMilliseconds))
        ) {
            throw new InvalidDataType(
                'SyncPoll()',
                'Polling failed: Invalid input for field "options?.maximumWaitingTimeInMilliseconds" it must be a positive number',
                {
                    requestIntervalInMilliseconds
                }
            );
        }

        this.requestIntervalInMilliseconds = requestIntervalInMilliseconds;
    }

    /**
     * Get how many iterations have been done.
     *
     * @returns The number of iterations.
     */
    public get getCurrentIteration(): number {
        return this.currentIteration;
    }

    /**
     * Basic interval loop function.
     * This function must be called into setInterval.
     * It calls the promise and emit the event.
     */
    private async _intervalLoop(): Promise<void> {
        try {
            // Get data and emit the event
            const data = await this.pollingFunction();
            this.emit('data', { data, eventPoll: this });
        } catch (error) {
            // Set error
            this.error = new PollExecution(
                'EventPoll - main interval loop function',
                `Error during the execution of the poll ${(error as Error).message}`,
                {
                    functionName: this.pollingFunction.name
                }
            );

            // Emit the error
            this.emit('error', { error: this.error });

            // Stop listening?
            if (this.hasToStopOnError) {
                this.stopListen();
            }
        }

        // Increment the iteration
        this.currentIteration = this.currentIteration + 1;
    }

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
    public onData(
        onDataCallback: (
            data: TReturnType,
            eventPoll: EventPoll<TReturnType>
        ) => void
    ): this {
        this.on('data', (data) => {
            onDataCallback(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                data.data as TReturnType,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                data.eventPoll as EventPoll<TReturnType>
            );
        });

        return this;
    }

    /* --- Overloaded of 'on' event emitter start --- */

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
    public onError(onErrorCallback: (error: Error) => void): this {
        this.on('error', (error) => {
            onErrorCallback(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                error.error as Error
            );
        });

        return this;
    }

    /**
     * Listen to the 'start' event.
     * This happens when the poll is stopped.
     *
     * @param onStartCallback - The callback to be called when the event is emitted.
     */
    public onStart(
        onStartCallback: (eventPoll: EventPoll<TReturnType>) => void
    ): this {
        this.on('start', (data) => {
            onStartCallback(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                data.eventPoll as EventPoll<TReturnType>
            );
        });

        return this;
    }

    /**
     * Listen to the 'stop' event.
     * This happens when the poll is stopped.
     *
     * @param onStopCallback - The callback to be called when the event is emitted.
     */
    public onStop(
        onStopCallback: (eventPoll: EventPoll<TReturnType>) => void
    ): this {
        this.on('stop', (data) => {
            onStopCallback(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                data.eventPoll as EventPoll<TReturnType>
            );
        });

        return this;
    }

    /**
     * Start listening to the event.
     */
    startListen(): void {
        // Start listening
        this.emit('start', { eventPoll: this });

        // Execute `_intervalLoop` and then set an interval which calls `_intervalLoop` every `requestIntervalInMilliseconds`
        void this._intervalLoop().then(() => {
            // Create an interval
            this.intervalId = setInterval(() => {
                void (async () => {
                    await this._intervalLoop();
                })();
            }, this.requestIntervalInMilliseconds);
        }); // No need for .catch(), errors are handled within _intervalLoop
    }

    /**
     * Stop listening to the event.
     */
    stopListen(): void {
        clearInterval(this.intervalId);
        this.emit('stop', { eventPoll: this });
    }

    /* --- Overloaded of 'on' event emitter end --- */
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
function createEventPoll<TReturnType>(
    callBack: () => Promise<TReturnType>,
    requestIntervalInMilliseconds: number,
    hasToStopOnError: boolean = true
): EventPoll<TReturnType> {
    return new EventPoll<TReturnType>(
        callBack,
        requestIntervalInMilliseconds,
        hasToStopOnError
    );
}

export { EventPoll, createEventPoll };
