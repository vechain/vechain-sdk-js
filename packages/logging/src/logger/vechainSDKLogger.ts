import { type LogFunctionType, type LoggerType } from './types';
import { _logLogFunction } from './log-logger';
import { _logErrorFunction } from './error-logger';
import { _logWarningFunction } from './warning-logger';

/**
 * Logger function that returns a log function based on the logger type.
 */
const VeChainSDKLogger = <TLoggerType extends LoggerType>(
    loggerType: TLoggerType
): LogFunctionType<typeof loggerType> => {
    if (loggerType === 'error')
        return _logErrorFunction as LogFunctionType<typeof loggerType>;

    if (loggerType === 'warning')
        return _logWarningFunction as LogFunctionType<typeof loggerType>;

    return _logLogFunction as LogFunctionType<typeof loggerType>;
};

export { VeChainSDKLogger };
