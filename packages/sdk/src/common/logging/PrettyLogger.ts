import { LoggerRegistry } from './LoggerRegistry';
import {
    Logger,
    type LogVerbosity,
    type LoggedItem,
    VERBOSITY_ORDER,
    type LoggerConfig
} from './types';
import { isBrowser } from '../utils/browser';

/**
 * A pretty logger, with color and icon.
 * Supported for terminal output and browser console.
 */
class PrettyLogger extends Logger {
    private config: LoggerConfig = {
        verbosity: 'info'
    };

    NODE_COLORS: Record<LogVerbosity, string> = {
        none: '',
        debug: '\x1b[90m', // gray
        info: '\x1b[34m', // blue
        warn: '\x1b[33m', // yellow
        error: '\x1b[31m' // red
    };
    NODE_RESET_COLOR = '\x1b[0m';
    ICONS: Record<LogVerbosity, string> = {
        none: '',
        debug: '🐛', // bug for debugging
        info: 'ℹ️', // info symbol
        warn: '⚠️', // warning triangle
        error: '❌' // red cross
    };
    BROWSER_COLORS: Record<LogVerbosity, string> = {
        none: '',
        debug: 'color: #999', // gray
        info: 'color: #007bff', // blue
        warn: 'color: #ffc107', // yellow
        error: 'color: #dc3545' // red
    };

    /**
     * Set the verbosity filter of the logger.
     * @param verbosity - The verbosity to set.
     */
    setConfig(config: LoggerConfig): void {
        this.config = config;
    }

    /**
     * Reset the verbosity filter of the logger to default.
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
        if (verbosityOrder < VERBOSITY_ORDER[this.config.verbosity]) {
            return;
        }
        // change timestamp to ISO string
        const timestamp = new Date(entry.timestamp).toISOString();
        // get the icon for the verbosity
        const icon = this.ICONS[entry.verbosity];
        const jsonContext =
            entry.context === undefined
                ? ''
                : JSON.stringify(
                      entry.context,
                      (_: string, v: unknown): unknown =>
                          typeof v === 'bigint' ? v.toString() : v
                  );
        if (isBrowser) {
            // log the entry as a CSS string
            const cssColor = this.BROWSER_COLORS[entry.verbosity];
            console.log(
                `%c${icon}  ${timestamp}  ${entry.message}  ${entry.source}  ${jsonContext}`,
                cssColor
            );
        } else {
            // log the entry using ANSI colors with a icon
            const ansiColor = this.NODE_COLORS[entry.verbosity];
            console.log(
                `${ansiColor}${icon}  ${timestamp}  ${entry.message}  ${entry.source}  ${jsonContext} ${this.NODE_RESET_COLOR}`
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

export { PrettyLogger };
