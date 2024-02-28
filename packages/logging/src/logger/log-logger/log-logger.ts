import type { LogFunctionType, LogLoggerData } from '../types';

/**
 * Log logger internal function.
 */
const _logLogFunction: LogFunctionType<'log'> = {
    log: (data: LogLoggerData) => {
        // Convert messages to string
        const messagesAsString = data.messages
            .map((message) => `- ${message}`)
            .join('\n');

        console.log(
            `\n****************** EVENT: ${data.title} ******************\n` +
                messagesAsString +
                `\n`
        );
    }
};

export { _logLogFunction };
