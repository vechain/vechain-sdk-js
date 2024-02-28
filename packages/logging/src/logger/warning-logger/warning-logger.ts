import type { LogFunctionType, LogLoggerData } from '../types';

/**
 * Warning logger internal function.
 */
const _logWarningFunction: LogFunctionType<'log'> = {
    log: (data: LogLoggerData) => {
        console.warn(
            `\n****************** WARNING: ${data.title} ******************\n` +
                `${data.messages.map((message) => `- ${message}`).join('\n')}` +
                `\n`
        );
    }
};

export { _logWarningFunction };
