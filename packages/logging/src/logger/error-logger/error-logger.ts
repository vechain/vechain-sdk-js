import type { ErrorLoggerData, LogFunctionType } from '../types';
import type { ErrorCode } from '@vechain/sdk-errors';

/**
 * Error logger internal function.
 */
const _logErrorFunction: LogFunctionType<'error'> = {
    log: <TErrorCode extends ErrorCode>(error: ErrorLoggerData<TErrorCode>) => {
        console.error(
            `\n****************** ERROR: ${error.errorCode} ******************\n` +
                `- Error message: '${error.errorMessage}'` +
                '\n- Error data:\n',
            error.errorData,
            `\n- Internal error:\n`,
            error.innerError,
            `\n`
        );
    }
};

export { _logErrorFunction };
