import type { LogFunctionType, LogLoggerData } from '../types';

/**
 * Log logger internal function.
 */
const _logLogFunction: LogFunctionType<'log'> = {
    log: (data: LogLoggerData) => {
        console.log(
            `\n****************** EVENT: ${data.title} ******************\n` +
                `${data.messages.map((message) => `- ${message}`).join('\n')}` +
                `\n`
        );
    }
};

export { _logLogFunction };
