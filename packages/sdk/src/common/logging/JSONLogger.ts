import {
    type LoggerConfig,
    Logger,
    type LoggedItem,
    VERBOSITY_ORDER
} from './types';
import { LoggerRegistry } from './LoggerRegistry';

/**
 * A in-builtjson logger for consumption by external tools.
 */
class JSONLogger extends Logger {
    private config: LoggerConfig = {
        verbosity: 'info'
    };

    /**
     * Set the config of the logger.
     * @param config - The config to set.
     */
    setConfig(config: LoggerConfig): void {
        this.config = config;
    }

    /**
     * Reset the config of the logger to default.
     */
    resetConfig(): void {
        this.config = {
            verbosity: 'info'
        };
    }

    /**
     * Get the config of the logger.
     * @returns The config of the logger.
     */
    getConfig(): LoggerConfig {
        return this.config;
    }

    /**
     * Log an item.
     * @param entry - The log item to log.
     */
    log(entry: LoggedItem): void {
        const verbosityOrder = VERBOSITY_ORDER[entry.verbosity];
        if (verbosityOrder >= VERBOSITY_ORDER[this.config.verbosity]) {
            // change timestamp to ISO string
            const timestamp = new Date(entry.timestamp).toISOString();
            // log the entry as a json string
            console.log(
                JSON.stringify(
                    { ...entry, timestamp },
                    (_: string, v: unknown): unknown =>
                        typeof v === 'bigint' ? v.toString() : v
                )
            );
        }
    }

    /**
     * Register as the default logger.
     */
    register(): void {
        LoggerRegistry.getInstance().registerLogger(this);
    }
}

export { JSONLogger };
