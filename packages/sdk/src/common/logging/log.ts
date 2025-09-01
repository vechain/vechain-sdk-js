import { LoggerRegistry } from './LoggerRegistry';
import { type LoggedItem, type LogItem } from './types';

/**
 * Log an item.
 * @param log - The log item to log.
 */
function log(entry: LogItem): void {
    const logger = LoggerRegistry.getInstance().getRegisteredLogger();
    if (logger === undefined) return;
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

export { log };
