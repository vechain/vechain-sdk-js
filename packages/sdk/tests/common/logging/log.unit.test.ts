import { describe, expect, jest, test } from '@jest/globals';
import {
    Logger,
    LoggerRegistry,
    type LoggerConfig,
    type LogVerbosity,
    type LoggedItem,
    type LogItem,
    log,
    PrettyLogger
} from '@common/logging';

// example callback logger
class ErrorThrowingLogger extends Logger {
    DEFAULT_VERBOSITY: LogVerbosity = 'info';
    private config: LoggerConfig = {
        verbosity: this.DEFAULT_VERBOSITY
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    log(entry: LoggedItem): void {
        throw new Error('test logger error');
    }
    setConfig(config: LoggerConfig): void {
        this.config = config;
    }
    resetConfig(): void {
        this.config = {
            verbosity: this.DEFAULT_VERBOSITY
        };
    }
    getConfig(): LoggerConfig {
        return this.config;
    }
}

/**
 * @group unit
 */
describe('log', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        LoggerRegistry.getInstance().clearRegisteredLogger();
        delete process.env.SDK_LOG_VERBOSITY;
    });
    test('when no logger is registered, it does nothing', () => {
        LoggerRegistry.getInstance().clearRegisteredLogger();
        const consoleSpy = jest.spyOn(console, 'log');
        const logItem: LogItem = {
            verbosity: 'info',
            message: 'test',
            source: 'test',
            context: { data: { key: 'value' } }
        };
        log(logItem);
        expect(consoleSpy).not.toHaveBeenCalled();
    });
    test('when logger throws an error, it logs the error', () => {
        const errorThrowingLogger = new ErrorThrowingLogger();
        LoggerRegistry.getInstance().registerLogger(errorThrowingLogger);
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const logItem: LogItem = {
            verbosity: 'info',
            message: 'test',
            source: 'test',
            context: { data: { key: 'value' } }
        };
        log(logItem);
        const [msg, err] = consoleSpy.mock.calls[0] as [string, Error];
        expect(msg).toContain('Logger callback failed');
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('test logger error');
    });
    test('when verbosity is none, it does nothing', () => {
        const logger = new PrettyLogger();
        LoggerRegistry.getInstance().registerLogger(logger);
        logger.setConfig({
            verbosity: 'none'
        });
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const logItem: LogItem = {
            verbosity: 'none',
            message: 'test',
            source: 'test',
            context: { data: { key: 'value' } }
        };
        log(logItem);
        expect(consoleSpy).not.toHaveBeenCalled();
    });
});
