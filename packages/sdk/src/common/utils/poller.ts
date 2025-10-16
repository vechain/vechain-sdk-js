import { IllegalArgumentError } from '@common/errors';
import { log } from '@common/logging';

type Producer<T> = () => Promise<T> | T;
type Consumer<T> = (value: T) => void;
type ErrorConsumer = (error: Error) => void;

interface EventPollHandlers<T> {
    onData: (handler: Consumer<T>) => EventPollController<T>;
    onError: (handler: ErrorConsumer) => EventPollController<T>;
}

/**
 * Options for configuring the event poller.
 *
 * @template T The type of data produced by the poller.
 */
interface EventPollOptions<T> {
    /**
     * The function that produces the value to be polled.
     */
    producer: Producer<T>;
    /**
     * The interval in milliseconds between polling attempts.
     * Defaults to 1000 ms if not specified.
     */
    intervalMs?: number;
    /**
     * Whether to stop polling on error.
     * If true or omitted, polling stops on any non-network error.
     * For network errors, polling continues until `maxNetworkErrors` is exceeded.
     * If false, polling continues on non-network errors as well.
     */
    stopOnError?: boolean;
    /**
     * The maximum number of consecutive network errors allowed before stopping polling.
     * Defaults to 5 if not specified.
     */
    maxNetworkErrors?: number;
}

interface EventPollController<T> extends EventPollHandlers<T> {
    start: () => void;
    stop: () => void;
    getState: () => EventPollState;
}

interface EventPollState {
    iterations: number;
    isRunning: boolean;
}

interface WaitUntilOptions<T> {
    task: Producer<T>;
    predicate: (result: T) => boolean;
    intervalMs?: number;
    timeoutMs?: number;
    maxNetworkErrors?: number;
}

const DEFAULT_INTERVAL_MS = 1_000;
const DEFAULT_MAX_NETWORK_ERRORS = 5;

export function createEventPoll<T>(
    options: EventPollOptions<T>
): EventPollController<T> {
    const intervalMs = validateInterval(
        options.intervalMs ?? DEFAULT_INTERVAL_MS,
        'createEventPoll(options.intervalMs)'
    );
    const maxNetworkErrors =
        options.maxNetworkErrors ?? DEFAULT_MAX_NETWORK_ERRORS;
    if (maxNetworkErrors <= 0) {
        throw new IllegalArgumentError(
            'createEventPoll(options.maxNetworkErrors)',
            'maxNetworkErrors must be greater than zero',
            { maxNetworkErrors }
        );
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    let iterations = 0;
    let running = false;
    let consecutiveNetworkErrors = 0;
    let dataHandler: Consumer<T> | undefined;
    let errorHandler: ErrorConsumer | undefined;

    const execute = async (): Promise<void> => {
        try {
            const result = await options.producer();
            consecutiveNetworkErrors = 0;
            dataHandler?.(result);
        } catch (error) {
            if (isNetworkError(error)) {
                consecutiveNetworkErrors += 1;
                debugNetworkError('poller', 'poller network error', {
                    consecutiveNetworkErrors
                });
                if (consecutiveNetworkErrors > maxNetworkErrors) {
                    debugNetworkError(
                        'poller',
                        'poller max network errors reached'
                    );
                    stop();
                    errorHandler?.(wrapError(error));
                }
                return;
            }
            errorHandler?.(wrapError(error));
            if (options.stopOnError !== false) {
                stop();
            }
        } finally {
            iterations += 1;
        }
    };

    const start = (): void => {
        if (running) {
            return;
        }
        running = true;
        void execute();
        timer = setInterval(() => {
            void execute();
        }, intervalMs);
    };

    const stop = (): void => {
        if (!running) {
            return;
        }
        running = false;
        if (timer !== undefined) {
            clearInterval(timer);
            timer = undefined;
        }
    };

    return {
        start,
        stop,
        getState: () => ({ iterations, isRunning: running }),
        onData(handler: Consumer<T>): EventPollController<T> {
            dataHandler = handler;
            return this;
        },
        onError(handler: ErrorConsumer): EventPollController<T> {
            errorHandler = handler;
            return this;
        }
    };
}

export async function waitUntil<T>(options: WaitUntilOptions<T>): Promise<T> {
    const intervalMs = validateInterval(
        options.intervalMs ?? DEFAULT_INTERVAL_MS,
        'waitUntil(options.intervalMs)'
    );
    const timeoutMs = options.timeoutMs;
    if (timeoutMs !== undefined && timeoutMs <= 0) {
        throw new IllegalArgumentError(
            'waitUntil(options.timeoutMs)',
            'timeoutMs must be greater than zero',
            { timeoutMs }
        );
    }
    const maxNetworkErrors =
        options.maxNetworkErrors ?? DEFAULT_MAX_NETWORK_ERRORS;
    if (maxNetworkErrors <= 0) {
        throw new IllegalArgumentError(
            'waitUntil(options.maxNetworkErrors)',
            'maxNetworkErrors must be greater than zero',
            { maxNetworkErrors }
        );
    }

    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (timeoutMs !== undefined) {
        timeout = setTimeout(() => {
            controller.abort();
        }, timeoutMs);
    }

    let consecutiveNetworkErrors = 0;
    try {
        while (true) {
            if (controller.signal.aborted) {
                throw new IllegalArgumentError(
                    'waitUntil()',
                    'Timed out while waiting for predicate'
                );
            }
            try {
                const result = await options.task();
                consecutiveNetworkErrors = 0;
                if (options.predicate(result)) {
                    return result;
                }
            } catch (error) {
                if (isNetworkError(error)) {
                    consecutiveNetworkErrors += 1;
                    debugNetworkError('waitUntil', 'waitUntil network error', {
                        consecutiveNetworkErrors
                    });
                    if (consecutiveNetworkErrors > maxNetworkErrors) {
                        throw wrapError(error);
                    }
                } else {
                    throw wrapError(error);
                }
            }
            try {
                await delay(intervalMs, controller.signal);
            } catch (error) {
                if (controller.signal.aborted) {
                    throw new IllegalArgumentError(
                        'waitUntil()',
                        'Timed out while waiting for predicate'
                    );
                }
                throw wrapError(error);
            }
        }
    } finally {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
    }
}

function validateInterval(value: number, context: string): number {
    if (!Number.isFinite(value) || value <= 0) {
        throw new IllegalArgumentError(
            context,
            'interval must be a positive finite number',
            { interval: value }
        );
    }
    return value;
}

async function delay(ms: number, signal: AbortSignal): Promise<void> {
    await new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
            signal.removeEventListener('abort', onAbort);
            resolve();
        }, ms);

        const onAbort = (): void => {
            clearTimeout(timer);
            signal.removeEventListener('abort', onAbort);
            resolve();
        };

        signal.addEventListener('abort', onAbort, { once: true });
    });
}

function extractStatusCode(error: unknown): number | undefined {
    if (typeof error === 'object' && error !== null) {
        const status = (error as { statusCode?: unknown }).statusCode;
        if (typeof status === 'number') {
            return status;
        }
        const responseStatus = (error as { response?: { status?: unknown } })
            .response?.status;
        if (typeof responseStatus === 'number') {
            return responseStatus;
        }
    }
    return undefined;
}

function isNetworkError(error: unknown): boolean {
    return extractStatusCode(error) !== undefined;
}

function debugNetworkError(
    scope: 'poller' | 'waitUntil',
    message: string,
    meta?: unknown
): void {
    const context =
        meta !== undefined && typeof meta === 'object' && meta !== null
            ? (meta as Record<string, unknown>)
            : meta !== undefined
              ? { value: meta }
              : undefined;
    log.debug({
        source: `poller:${scope}`,
        message,
        context
    });
}

function wrapError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

export type {
    EventPollController,
    EventPollOptions,
    EventPollState,
    WaitUntilOptions
};
