import {
    type LoggerConfigSource,
    type Logger,
    type LogVerbosity,
    type LoggerConfig
} from './types';

/**
 * A registry for current logger and its config.
 */
class LoggerRegistry {
    private static instance?: LoggerRegistry;
    private currentLogger?: Logger;
    private static configSource: LoggerConfigSource = process.env;
    public static readonly DEFAULT_LOG_VERBOSITY: LogVerbosity = 'info';

    private constructor() {} // private for singleton

    /**
     * Get the instance of the logger registry.
     * @returns The instance of the logger registry.
     */
    public static getInstance(): LoggerRegistry {
        LoggerRegistry.instance ??= new LoggerRegistry();
        return LoggerRegistry.instance;
    }

    /**
     * Set the current registered logger.
     * @param logger - The logger to set.
     */
    public registerLogger(logger: Logger): void {
        const config = this.loadConfig();
        this.currentLogger = logger;
        this.currentLogger.setConfig(config);
    }

    /**
     * Get the current registered logger.
     * @returns The current registered logger.
     */
    public getRegisteredLogger(): Logger | undefined {
        return this.currentLogger;
    }

    /**
     * Clear the current registered logger.
     */
    public clearRegisteredLogger(): void {
        this.currentLogger = undefined;
    }

    /**
     * Load the logger config.
     * Config is loaded when a logger is registered.
     * If the config is not set, the default config is used.
     * The logger then receives a callback with the set config.
     * @param config - The source of the logger config. Defaults to process.env.
     * @returns The logger config.
     */
    private loadConfig(): LoggerConfig {
        const verbosity = LoggerRegistry.configSource
            .SDK_LOG_VERBOSITY as LogVerbosity;
        if (verbosity === undefined) {
            return {
                verbosity: LoggerRegistry.DEFAULT_LOG_VERBOSITY
            };
        } else {
            return { verbosity };
        }
    }

    /**
     * Set the config source.
     * @param source - The source of the logger config. Defaults to process.env.
     */
    public static setConfigSource(
        source: LoggerConfigSource = process.env
    ): void {
        LoggerRegistry.configSource = source;
    }
}

export { LoggerRegistry };
