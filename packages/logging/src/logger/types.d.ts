import { type DataType, type ErrorCode } from '@vechain/sdk-errors';

/**
 * Type representing the different types of loggers.
 * Currently, 'error' and 'log' and 'warning' are supported.
 */
type LoggerType = 'error' | 'log' | 'warning';

/**
 * Interface representing the data to be logged by the 'error' logger.
 */
interface ErrorLoggerData<TErrorCode extends ErrorCode> {
    errorCode: TErrorCode;
    errorMessage: string;
    errorData?: DataType<TErrorCode>;
    innerError?: unknown;
}

/**
 * Interface representing the data to be logged by the 'log' logger.
 */
interface LogLoggerData {
    title: string;
    messages: string[];
}

/**
 * Interface representing the data to be logged by the 'warning' logger.
 */
type WarningLoggerData = LogLoggerData;

/**
 * Function type used for logging will depend on from the logger type.
 * An error logger will have different function type than a log logger.
 *
 * -e.g.-
 *
 * VeChainSDKLogger('log').log({
 *     title: 'Title of the log message ...',
 *     messages: ['Message to log 1...', 'Message to log 2...', ...]
 * });
 *
 * VeChainSDKLogger('error').log({
 *     errorCode: DATA.INVALID_DATA_TYPE,
 *     errorMessage: 'Message we want to use for invalid data type ...',
 *     errorData: input,
 *     innerError: new Error('This is the inner error')
 * });
 *
 */
type LogFunctionType<TLoggerType extends LoggerType> =
    // Logger function type used for 'error' logs
    TLoggerType extends 'error'
        ? {
              log: <TErrorCode extends ErrorCode>(
                  error: ErrorLoggerData<TErrorCode>
              ) => void;
          }
        : // Logger function type used for 'log' logs
          TLoggerType extends 'log'
          ? { log: (data: LogLoggerData) => void }
          : // Logger function type used for 'warning' logs
            TLoggerType extends 'warning'
            ? { log: (data: WarningLoggerData) => void }
            : never;

export {
    type LoggerType,
    type ErrorLoggerData,
    type LogLoggerData,
    type LogFunctionType,
    type WarningLoggerData
};
