import { describe, expect, jest, test } from '@jest/globals';
import {
    log,
    LoggerRegistry,
    type LoggedItem,
    JSONLogger
} from '@common/logging';

/**
 * @group unit
 */
describe('JSONLogger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        LoggerRegistry.getInstance().clearRegisteredLogger();
        delete process.env.SDK_LOG_VERBOSITY;
    });

    test('can register the logger', () => {
        const testLogger = new JSONLogger();
        testLogger.register();
        expect(
            LoggerRegistry.getInstance().getRegisteredLogger()
        ).toBeInstanceOf(JSONLogger);
    });
    test('when logger is registered, it receives the config', () => {
        const testLogger = new JSONLogger();
        process.env.SDK_LOG_VERBOSITY = 'debug';
        testLogger.register();
        expect(testLogger.getConfig()).toEqual({
            verbosity: 'debug'
        });
    });
    test('console output <- all fields <- ok', () => {
        const testLogger = new JSONLogger();
        testLogger.register();
        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        log({
            verbosity: 'info',
            message: 'the message',
            source: 'test',
            context: { data: { key: 'value' } }
        });
        const arg = consoleSpy.mock.calls[0][0] as unknown as string;
        const payload = JSON.parse(arg) as LoggedItem;
        expect(payload).toEqual(
            expect.objectContaining({
                verbosity: 'info',
                message: 'the message',
                source: 'test',
                context: { data: { key: 'value' } }
            })
        );
    });
    test('default verbosity <- info <- ok', () => {
        const testLogger = new JSONLogger();
        testLogger.register();
        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        log({
            verbosity: 'debug',
            message: 'debug message'
        });
        expect(consoleSpy).not.toHaveBeenCalled();
    });
    test('set logger config <- verbosity <- ok', () => {
        const testLogger = new JSONLogger();
        testLogger.register();
        LoggerRegistry.getInstance().getRegisteredLogger()?.setConfig({
            verbosity: 'debug'
        });
        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        process.env.SDK_LOG_VERBOSITY = 'debug';
        log({
            verbosity: 'debug',
            message: 'debug message'
        });
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleSpy.mock.calls[0][0]).toContain('debug message');
    });
    test('can reset the config', () => {
        const testLogger = new JSONLogger();
        testLogger.register();
        LoggerRegistry.getInstance().getRegisteredLogger()?.setConfig({
            verbosity: 'debug'
        });
        testLogger.resetConfig();
        expect(testLogger.getConfig()).toEqual({
            verbosity: 'info'
        });
    });
});
