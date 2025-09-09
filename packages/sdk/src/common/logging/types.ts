/**
 * The verbosity of a log message.
 */
type LogVerbosity = 'debug' | 'info' | 'warn' | 'error' | 'none';

/**
 * The numerical order of the verbosity levels.
 */
const VERBOSITY_ORDER: Record<LogVerbosity, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4
};

/**
 * An item that is to be logged from the user.
 */
interface LogItemWithVerbosity {
    verbosity: LogVerbosity;
    message: string;
    source?: string;
    context?: Record<string, unknown>;
}

/**
 * An item that is to be logged without a verbosity level.
 */
type LogItem = Omit<LogItemWithVerbosity, 'verbosity'>;

/**
 * An expanded log item sent to the logger.
 */
interface LoggedItem extends LogItem {
    timestamp: number;
}

/**
 * Abstract logger class.
 */
abstract class Logger {
    abstract log(entry: LoggedItem): void;
    abstract setConfig(config: LoggerConfig): void;
    abstract resetConfig(): void;
    abstract getConfig(): LoggerConfig;
}

/**
 * The source of the logger config.
 */
type LoggerConfigSource = Record<string, string | undefined>;

/**
 * The logger config.
 */
interface LoggerConfig {
    verbosity: LogVerbosity;
}

export {
    type LogVerbosity,
    type LogItem,
    type LogItemWithVerbosity,
    type LoggedItem,
    type LoggerConfigSource,
    type LoggerConfig,
    Logger,
    VERBOSITY_ORDER
};
