import { type LogFunctionType, type LoggerType } from './types';
import { _logDataFunction } from './log-logger';
import { _logErrorFunction } from './error-logger';

/**
 * Logger function that returns a log function based on the logger type.
 */
const VechainSDKLogger = <TLoggerType extends LoggerType>(
    loggerType: TLoggerType
): LogFunctionType<typeof loggerType> => {
    if (loggerType === 'error')
        return _logErrorFunction as LogFunctionType<typeof loggerType>;

    return _logDataFunction as LogFunctionType<typeof loggerType>;
};

// VechainSDKLogger('log').log({
//     title: 'Title of the log message ...',
//     messages: ['Message to log...']
// });
//
// VechainSDKLogger('error').log({
//     errorCode: DATA.INVALID_DATA_TYPE,
//     errorMessage: 'Message we want to use for invalid data type ...',
//     errorData: { input: 'asdsa' },
//     innerError: new Error('This is the inner error')
// });

export { VechainSDKLogger };
