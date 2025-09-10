import { LoggerRegistry } from './LoggerRegistry';
import {
    type LoggedItem,
    type LogItem,
    type LogItemWithVerbosity
} from './types';

/**
 * Log an item.
 * @param log - The log item to log.
 */
function baseLog(entry: LogItemWithVerbosity): void {
    const logger = LoggerRegistry.getInstance().getRegisteredLogger();
    // if no registered logger, return
    if (logger === undefined) return;
    const config = logger.getConfig();
    // if the logger is configured to not log, return
    if (config.verbosity === 'none') return;
    // default source to 'VeChain SDK'
    entry.source ??= 'VeChain SDK';
    try {
        const timestamp = Date.now();
        const loggedEntry: LoggedItem = {
            ...entry,
            timestamp
        };
        logger.log(loggedEntry);
    } catch (err) {
        console.error('❌ Logger callback failed:', err);
    }
}

/**
 * The log function, with verbosity levels.
 */
const log = Object.assign(baseLog, {
    debug: (entry: LogItem) => {
        baseLog({ ...entry, verbosity: 'debug' });
    },
    info: (entry: LogItem) => {
        baseLog({ ...entry, verbosity: 'info' });
    },
    warn: (entry: LogItem) => {
        baseLog({ ...entry, verbosity: 'warn' });
    },
    error: (entry: LogItem) => {
        baseLog({ ...entry, verbosity: 'error' });
    },
    raw: (entry: LogItemWithVerbosity) => {
        baseLog(entry);
    }
});

export { log };
