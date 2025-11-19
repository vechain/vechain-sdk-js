"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPoll = void 0;
exports.createEventPoll = createEventPoll;
const events_1 = require("events");
const sdk_errors_1 = require("@vechain/sdk-errors");
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
class EventPoll extends events_1.EventEmitter {
    /**
     * The current iteration. It counts how many iterations have been done.
     * This parameter is useful to know how many iterations have been done.
     * For example, it can be used to stop the poll after a certain number of iterations.
     */
    currentIteration = 0;
    /**
     * Error thrown during the execution of the poll.
     */
    error;
    /**
     * Indicates whether to stop execution on error of the
     * {@link _intervalLoop} function.
     *
     * @type {boolean}
     */
    hasToStopOnError;
    /**
     * The interval used to poll.
     */
    intervalId;
    /**
     * The function to be called.
     */
    pollingFunction;
    /**
     * The interval of time (in milliseconds) between each request.
     */
    requestIntervalInMilliseconds;
    /**
     * Constructor for creating an instance of EventPoll.
     *
     * @param {Function} pollingFunction - The function to be executed repeatedly.
     * @param {number} requestIntervalInMilliseconds - The interval in milliseconds between each execution of the polling function.
     * @param {boolean} [hasToStopOnError=true] - Indicates whether to stop polling if an error occurs.
     * @throws {InvalidDataType}
     */
    constructor(pollingFunction, requestIntervalInMilliseconds, hasToStopOnError) {
        super();
        this.pollingFunction = pollingFunction;
        this.hasToStopOnError = hasToStopOnError;
        // Positive number for request interval
        if (requestIntervalInMilliseconds !== undefined &&
            (requestIntervalInMilliseconds <= 0 ||
                !Number.isInteger(requestIntervalInMilliseconds))) {
            throw new sdk_errors_1.InvalidDataType('SyncPoll()', 'Polling failed: Invalid input for field "options?.maximumWaitingTimeInMilliseconds" it must be a positive number', {
                requestIntervalInMilliseconds
            });
        }
        this.requestIntervalInMilliseconds = requestIntervalInMilliseconds;
    }
    /**
     * Get how many iterations have been done.
     *
     * @returns The number of iterations.
     */
    get getCurrentIteration() {
        return this.currentIteration;
    }
    /**
     * Basic interval loop function.
     * This function must be called into setInterval.
     * It calls the promise and emit the event.
     */
    async _intervalLoop() {
        try {
            // Get data and emit the event
            const data = await this.pollingFunction();
            this.emit('data', { data, eventPoll: this });
        }
        catch (error) {
            // Check if this is a network communication error
            if (error instanceof sdk_errors_1.HttpNetworkError) {
                // For network errors, we might want to continue polling
                // Log the network error but don't stop polling
                console.warn('Network error during polling, continuing:', error.message);
                // Emit the network error but don't stop
                this.emit('error', { error });
                // Don't stop polling for network errors unless explicitly configured
                if (this.hasToStopOnError) {
                    this.stopListen();
                }
            }
            else {
                // For other errors, create a PollExecution error
                this.error = new sdk_errors_1.PollExecution('EventPoll - main interval loop function', `Error during the execution of the poll ${error.message}`, {
                    functionName: this.pollingFunction.name
                });
                // Emit the error
                this.emit('error', { error: this.error });
                // Stop listening for non-network errors
                if (this.hasToStopOnError) {
                    this.stopListen();
                }
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
    onData(onDataCallback) {
        this.on('data', (data) => {
            onDataCallback(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            data.data, 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            data.eventPoll);
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
    onError(onErrorCallback) {
        this.on('error', (error) => {
            onErrorCallback(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            error.error);
        });
        return this;
    }
    /**
     * Listen to the 'start' event.
     * This happens when the poll is stopped.
     *
     * @param onStartCallback - The callback to be called when the event is emitted.
     */
    onStart(onStartCallback) {
        this.on('start', (data) => {
            onStartCallback(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            data.eventPoll);
        });
        return this;
    }
    /**
     * Listen to the 'stop' event.
     * This happens when the poll is stopped.
     *
     * @param onStopCallback - The callback to be called when the event is emitted.
     */
    onStop(onStopCallback) {
        this.on('stop', (data) => {
            onStopCallback(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            data.eventPoll);
        });
        return this;
    }
    /**
     * Start listening to the event.
     */
    startListen() {
        // Start listening
        this.emit('start', { eventPoll: this });
        // Execute `_intervalLoop` and then set an interval which calls `_intervalLoop` every `requestIntervalInMilliseconds`
        void this._intervalLoop().then(() => {
            // Create an interval
            this.intervalId = setInterval(() => {
                void (async () => {
                    try {
                        await this._intervalLoop();
                    }
                    catch (error) {
                        // Log the error for debugging
                        console.error('EventPoll interval error:', error);
                        // If we should stop on error, stop listening permanently
                        if (this.hasToStopOnError) {
                            this.stopListen();
                        }
                        else {
                            // If we shouldn't stop on error, continue with the next iteration
                            // The error is already handled within _intervalLoop
                        }
                    }
                })();
            }, this.requestIntervalInMilliseconds);
        }); // No need for .catch(), errors are handled within _intervalLoop
    }
    /**
     * Stop listening to the event.
     */
    stopListen() {
        clearInterval(this.intervalId);
        this.emit('stop', { eventPoll: this });
    }
}
exports.EventPoll = EventPoll;
/**
 * Creates an event poll that performs a callback function repeatedly at a specified interval.
 * This method is useful to create an event poll in a more readable way.
 *
 * @param {Function} callBack - The callback function to be executed on each interval. It should return a Promise.
 * @param {number} requestIntervalInMilliseconds - The interval in milliseconds at which the callback function will be executed.
 * @param {boolean} [hasToStopOnError=true] - Optional parameter to specify whether the poll should stop on error. Default is true.
 * @returns {EventPoll} - The created event poll instance.
 */
function createEventPoll(callBack, requestIntervalInMilliseconds, hasToStopOnError = true) {
    return new EventPoll(callBack, requestIntervalInMilliseconds, hasToStopOnError);
}
