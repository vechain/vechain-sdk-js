import { EventEmitter } from 'events';

/**
 * Poll in an event based way.
 * This Poll is Asynchronous. It exploits:
 * - The EventEmitter to emit events
 * - The setInterval function to poll
 *
 * @example It can be used to trigger events every time
 *  - When balance is updated after a transaction is send a message is sent
 *  - When a transaction is mined a message is sent
 *  - When a certain block is mined an operation can start
 *  ...
 */
class EventPoll<TReturnType> extends EventEmitter {
    private readonly callBack: () => Promise<TReturnType>;
    private readonly requestIntervalInMilliseconds: number;
    private intervalId?: NodeJS.Timeout;

    /**
     * Create a new eventPoll.
     *
     * @param callBack - The function to be called.
     * @param requestIntervalInMilliseconds - The interval of time (in milliseconds) between each request.
     */
    constructor(
        callBack: () => Promise<TReturnType>,
        requestIntervalInMilliseconds: number
    ) {
        super();
        this.callBack = callBack;
        this.requestIntervalInMilliseconds = requestIntervalInMilliseconds;
    }

    startListen(): void {
        this.intervalId = setInterval(() => {
            this.callBack()
                .then((data) => {
                    this.emit('data', data, this);
                })
                .catch((error) => {
                    this.emit('error', error);
                    this.stopListen();
                });
        }, this.requestIntervalInMilliseconds);
    }

    stopListen(): void {
        clearInterval(this.intervalId);
    }
}

export { EventPoll };
