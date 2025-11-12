import { describe, expect, jest, test } from '@jest/globals';
import {
    LoggerRegistry,
    type LoggedItem,
    Logger,
    type LoggerConfig,
    type LogVerbosity
} from '@common/logging';

// example callback logger
class TestLogger extends Logger {
    DEFAULT_VERBOSITY: LogVerbosity = 'info';
    private config: LoggerConfig = {
        verbosity: this.DEFAULT_VERBOSITY
    };
    log(entry: LoggedItem): void {
        console.log(entry);
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
describe('LoggerRegistry', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        // clear the registered logger and reset env variables
        LoggerRegistry.getInstance().clearRegisteredLogger();
        delete process.env.SDK_LOG_VERBOSITY;
    });
    test('when logger registered, it should be set as the current logger', () => {
        LoggerRegistry.getInstance().registerLogger(new TestLogger());
        expect(
            LoggerRegistry.getInstance().getRegisteredLogger()
        ).toBeInstanceOf(TestLogger);
    });
    test('when logger is registered, it receives the default config', () => {
        const testLogger = new TestLogger();
        LoggerRegistry.getInstance().registerLogger(testLogger);
        expect(testLogger.getConfig()).toEqual({
            verbosity: 'info'
        });
    });
    test('when logger is registered, it receives the config from process.env', () => {
        const testLogger = new TestLogger();
        process.env.SDK_LOG_VERBOSITY = 'debug';
        LoggerRegistry.getInstance().registerLogger(testLogger);
        expect(testLogger.getConfig()).toEqual({
            verbosity: 'debug'
        });
    });
    test('when logger is registered, it receives the config from a user-defined source', () => {
        const configSource = { SDK_LOG_VERBOSITY: 'debug' };
        LoggerRegistry.setConfigSource(configSource);
        const testLogger = new TestLogger();
        LoggerRegistry.getInstance().registerLogger(testLogger);
        expect(testLogger.getConfig()).toEqual({
            verbosity: 'debug'
        });
    });
    test('when env variable is not set, the default config is used', () => {
        delete process.env.SDK_LOG_VERBOSITY;
        LoggerRegistry.setConfigSource(process.env);
        const testLogger = new TestLogger();
        LoggerRegistry.getInstance().registerLogger(testLogger);
        expect(testLogger.getConfig()).toEqual({
            verbosity: 'info'
        });
    });
    test('when set config source is called, it defaults to info level', () => {
        LoggerRegistry.setConfigSource();
        const testLogger = new TestLogger();
        LoggerRegistry.getInstance().registerLogger(testLogger);
        expect(testLogger.getConfig()).toEqual({
            verbosity: 'info'
        });
    });
    test('When logger is cleared, current logger is undefined', () => {
        LoggerRegistry.getInstance().registerLogger(new TestLogger());
        LoggerRegistry.getInstance().clearRegisteredLogger();
        expect(
            LoggerRegistry.getInstance().getRegisteredLogger()
        ).toBeUndefined();
    });
});
