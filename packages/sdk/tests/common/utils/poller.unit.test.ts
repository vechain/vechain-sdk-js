/**
 * @group unit/common/utils
 */
import { describe, expect, jest, test } from '@jest/globals';
import {
    createEventPoll,
    waitUntil,
    type EventPollController
} from '@common/utils/poller';
import { log } from '@common/logging';
import { IllegalArgumentError } from '@common/errors';

const nextTick = async (): Promise<void> => {
    await Promise.resolve();
};

const stubDelay = async (): Promise<void> => {
    // Simulate delay resolution without aborting
    await nextTick();
};

describe('poller utilities', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setInterval');
        jest.spyOn(global, 'clearInterval');
        jest.spyOn(global, 'setTimeout');
        jest.spyOn(global, 'clearTimeout');
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('createEventPoll delivers data to handler and tracks iterations', async () => {
        const producer = jest.fn().mockResolvedValue('payload');
        const onData = jest.fn();

        const poller: EventPollController<string> = createEventPoll({
            producer,
            intervalMs: 100
        }).onData(onData);

        poller.start();

        await jest.advanceTimersByTimeAsync(250);

        expect(producer).toHaveBeenCalledTimes(3);
        expect(onData).toHaveBeenCalledTimes(3);
        expect(onData).toHaveBeenCalledWith('payload');
        expect(poller.getState()).toEqual({
            iterations: 3,
            isRunning: true
        });

        poller.stop();
        expect(poller.getState().isRunning).toBe(false);
    });

    test('createEventPoll stops after exceeding max network errors', async () => {
        const networkError = Object.assign(new Error('boom'), {
            statusCode: 500
        });
        const producer = jest.fn().mockRejectedValue(networkError);
        const onError = jest.fn();

        const poller = createEventPoll({
            producer,
            intervalMs: 50,
            maxNetworkErrors: 2,
            logger: {
                debug: jest.fn()
            }
        }).onError(onError);

        poller.start();
        await jest.advanceTimersByTimeAsync(200);

        expect(onError).toHaveBeenCalledWith(networkError);
        expect(poller.getState().isRunning).toBe(false);
    });

    test('createEventPoll triggers error handler without stop when stopOnError is false for non-network errors', async () => {
        const producer = jest
            .fn()
            .mockRejectedValueOnce(new Error('fail'))
            .mockResolvedValueOnce('ok');
        const onError = jest.fn();
        const onData = jest.fn();

        const poller = createEventPoll({
            producer,
            intervalMs: 50,
            maxNetworkErrors: 2,
            stopOnError: false
        })
            .onError(onError)
            .onData(onData);

        poller.start();
        await jest.advanceTimersByTimeAsync(120);

        expect(onError).toHaveBeenCalledWith(expect.any(Error));
        expect(onData).toHaveBeenCalledWith('ok');
        expect(poller.getState().isRunning).toBe(true);
        poller.stop();
    });

    test('createEventPoll stops on non-network error when stopOnError is true', async () => {
        const producer = jest.fn().mockRejectedValue(new Error('fatal'));
        const onError = jest.fn();

        const poller = createEventPoll({
            producer,
            intervalMs: 50,
            stopOnError: true
        }).onError(onError);

        poller.start();
        await jest.advanceTimersByTimeAsync(50);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(poller.getState().isRunning).toBe(false);
    });

    test('createEventPoll keeps running when stopOnError is false', async () => {
        const producer = jest
            .fn()
            .mockRejectedValueOnce(new Error('recoverable'))
            .mockResolvedValueOnce('ok');
        const onError = jest.fn();
        const onData = jest.fn();

        const poller = createEventPoll({
            producer,
            intervalMs: 50,
            stopOnError: false
        })
            .onError(onError)
            .onData(onData);

        poller.start();
        await jest.advanceTimersByTimeAsync(120);

        expect(onError).toHaveBeenCalledTimes(1);
        expect(onData).toHaveBeenCalledWith('ok');
        expect(poller.getState().isRunning).toBe(true);
        poller.stop();
    });

    test('createEventPoll logs recoverable network errors and resumes polling', async () => {
        const networkError = Object.assign(new Error('net'), {
            statusCode: 502
        });
        const producer = jest
            .fn()
            .mockRejectedValueOnce(networkError)
            .mockResolvedValueOnce('ok');
        const onData = jest.fn();
        const onError = jest.fn();

        const poller = createEventPoll({
            producer,
            intervalMs: 50,
            maxNetworkErrors: 3
        })
            .onData(onData)
            .onError(onError);

        const debugSpy = jest
            .spyOn(log, 'debug')
            .mockImplementation(() => undefined);

        poller.start();
        await jest.advanceTimersByTimeAsync(120);

        expect(debugSpy).toHaveBeenCalledWith({
            source: 'poller:poller',
            message: 'poller network error',
            context: { consecutiveNetworkErrors: 1 }
        });
        expect(onError).not.toHaveBeenCalled();
        expect(onData).toHaveBeenCalledWith('ok');
        poller.stop();
        debugSpy.mockRestore();
    });

    test('createEventPoll start is idempotent', async () => {
        const producer = jest.fn().mockResolvedValue('payload');

        const poller = createEventPoll({
            producer,
            intervalMs: 100
        });

        poller.start();
        poller.start();

        await jest.advanceTimersByTimeAsync(120);

        expect(producer).toHaveBeenCalledTimes(2);
        poller.stop();
    });

    test('createEventPoll stop is safe when not running', () => {
        const poller = createEventPoll({
            producer: jest.fn(),
            intervalMs: 100
        });

        expect(() => poller.stop()).not.toThrow();
        expect(poller.getState()).toEqual({ iterations: 0, isRunning: false });
    });

    test('createEventPoll stop is idempotent after running', async () => {
        const poller = createEventPoll({
            producer: jest.fn().mockResolvedValue('data'),
            intervalMs: 100
        });

        poller.start();
        await jest.advanceTimersByTimeAsync(50);
        poller.stop();

        expect(poller.getState().isRunning).toBe(false);
        expect(() => poller.stop()).not.toThrow();
    });

    test('waitUntil resolves when predicate becomes true', async () => {
        let value = 0;
        const task = jest.fn().mockImplementation(async () => {
            value += 1;
            return value;
        });

        const promise = waitUntil({
            task,
            predicate: (result) => (result as number) >= 3,
            intervalMs: 100
        });

        const expectation = expect(promise).resolves.toBe(3);
        await jest.advanceTimersByTimeAsync(350);
        await expectation;
        expect(task).toHaveBeenCalledTimes(3);
    });

    test('waitUntil throws after exceeding network error threshold', async () => {
        const networkError = Object.assign(new Error('net'), {
            statusCode: 503
        });
        const task = jest.fn().mockRejectedValue(networkError);

        const promise = waitUntil({
            task,
            predicate: () => false,
            intervalMs: 50,
            maxNetworkErrors: 1
        });

        const expectation = expect(promise).rejects.toThrow('net');
        await jest.advanceTimersByTimeAsync(150);
        await expectation;
    });

    test('waitUntil rejects when timeout is reached', async () => {
        const task = jest.fn().mockResolvedValue(null);

        const promise = waitUntil({
            task,
            predicate: () => false,
            intervalMs: 50,
            timeoutMs: 120
        });

        const expectation = expect(promise).rejects.toThrow(
            'Timed out while waiting for predicate'
        );
        await jest.advanceTimersByTimeAsync(200);
        await expectation;
    });

    test('waitUntil respects timeout abort signal', async () => {
        const task = jest.fn().mockResolvedValue(null);

        const promise = waitUntil({
            task,
            predicate: () => false,
            intervalMs: 50,
            timeoutMs: 100
        });

        const expectation = expect(promise).rejects.toThrow(
            'Timed out while waiting for predicate'
        );
        await jest.advanceTimersByTimeAsync(150);
        await expectation;
        expect(task).toHaveBeenCalledTimes(2);
    });

    test('waitUntil logs recoverable network errors before succeeding', async () => {
        const networkError = Object.assign(new Error('temporary'), {
            statusCode: 500
        });
        const task = jest
            .fn()
            .mockRejectedValueOnce(networkError)
            .mockResolvedValueOnce('ready');

        const promise = waitUntil({
            task,
            predicate: (value) => value === 'ready',
            intervalMs: 50
        });

        const debugSpy = jest
            .spyOn(log, 'debug')
            .mockImplementation(() => undefined);

        const expectation = expect(promise).resolves.toBe('ready');
        await jest.advanceTimersByTimeAsync(120);
        await expectation;
        expect(debugSpy).toHaveBeenCalledWith({
            source: 'poller:waitUntil',
            message: 'waitUntil network error',
            context: { consecutiveNetworkErrors: 1 }
        });
        debugSpy.mockRestore();
    });

    test('waitUntil resolves immediately when predicate is satisfied at first run', async () => {
        const task = jest.fn().mockResolvedValue(42);

        const result = await waitUntil({
            task,
            predicate: (value) => value === 42,
            intervalMs: 100
        });

        expect(result).toBe(42);
        expect(task).toHaveBeenCalledTimes(1);
    });

    test('invalid interval throws IllegalArgumentError', () => {
        expect(() =>
            createEventPoll({
                producer: () => 0,
                intervalMs: 0
            })
        ).toThrow(IllegalArgumentError);
        return expect(
            waitUntil({
                task: () => 0,
                predicate: () => true,
                intervalMs: -1
            })
        ).rejects.toBeInstanceOf(IllegalArgumentError);
    });

    test('invalid timeout throws IllegalArgumentError', () => {
        return expect(
            waitUntil({
                task: () => 0,
                predicate: () => true,
                timeoutMs: 0
            })
        ).rejects.toBeInstanceOf(IllegalArgumentError);
    });

    test('invalid maxNetworkErrors throws IllegalArgumentError', () => {
        expect(() =>
            createEventPoll({
                producer: () => 0,
                maxNetworkErrors: 0
            })
        ).toThrow(IllegalArgumentError);
        return expect(
            waitUntil({
                task: () => 0,
                predicate: () => true,
                maxNetworkErrors: 0
            })
        ).rejects.toBeInstanceOf(IllegalArgumentError);
    });

    test('waitUntil wraps non-network errors and stops immediately', async () => {
        const task = jest
            .fn()
            .mockRejectedValueOnce(new Error('boom'))
            .mockResolvedValueOnce('ok');

        await expect(
            waitUntil({
                task,
                predicate: () => false,
                intervalMs: 50
            })
        ).rejects.toThrow('boom');
    });
});

