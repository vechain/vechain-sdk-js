import { describe, expect, jest, test } from '@jest/globals';
import {
    log,
    LoggerRegistry,
    PrettyLogger,
    type LogItem,
    type LogItemWithVerbosity
} from '@common/logging';
import { isBrowser } from '@common/utils/browser';

/**
 * @group unit
 */
describe('PrettyLogger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        LoggerRegistry.getInstance().clearRegisteredLogger();
        delete process.env.SDK_LOG_VERBOSITY;
    });

    test('can register the logger', () => {
        const testLogger = new PrettyLogger();
        testLogger.register();
        expect(
            LoggerRegistry.getInstance().getRegisteredLogger()
        ).toBeInstanceOf(PrettyLogger);
    });
    test('when logger is registered, it receives the config', () => {
        const testLogger = new PrettyLogger();
        process.env.SDK_LOG_VERBOSITY = 'debug';
        testLogger.register();
        if (isBrowser) {
            expect(testLogger.getConfig()).toEqual({
                verbosity: 'info'
            });
        } else {
            expect(testLogger.getConfig()).toEqual({
                verbosity: 'debug'
            });
        }
    });
    test('console output <- all fields <- ok', () => {
        const testLogger = new PrettyLogger();
        testLogger.register();
        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        const logEntry: LogItemWithVerbosity = {
            verbosity: 'info',
            message: 'the message',
            source: 'test',
            context: { data: { key: 'value' } }
        };
        log(logEntry);
        const arg = consoleSpy.mock.calls[0][0] as unknown as string;
        expect(arg).toContain(logEntry.message);
        expect(arg).toContain(logEntry.source);
        expect(arg).toContain(JSON.stringify(logEntry.context));
    });
    test('default verbosity <- info <- ok', () => {
        const testLogger = new PrettyLogger();
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
        const testLogger = new PrettyLogger();
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
        const testLogger = new PrettyLogger();
        testLogger.register();
        LoggerRegistry.getInstance().getRegisteredLogger()?.setConfig({
            verbosity: 'debug'
        });
        testLogger.resetConfig();
        expect(testLogger.getConfig()).toEqual({
            verbosity: 'info'
        });
    });
    test('bigint should be converted to string', () => {
        const testLogger = new PrettyLogger();
        testLogger.register();
        const consoleSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(() => {});
        log({
            verbosity: 'info',
            message: 'bigint',
            context: { data: { key: BigInt(123) } }
        });
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleSpy.mock.calls[0][0]).toContain('123');
    });
});
