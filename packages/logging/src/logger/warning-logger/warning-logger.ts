import type { LogFunctionType, LogLoggerData } from '../types';

/**
 * Warning logger internal function.
 */
const _logWarningFunction: LogFunctionType<'log'> = {
    log: (data: LogLoggerData) => {
        // Convert messages to string
        const messagesAsString = data.messages
            .map((message) => `- ${message}`)
            .join('\n');

        console.warn(
            `\n****************** WARNING: ${data.title} ******************\n` +
                messagesAsString +
                `\n`
        );
    }
};

export { _logWarningFunction };
