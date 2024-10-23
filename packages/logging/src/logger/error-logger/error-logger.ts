import type { LogFunctionType } from '../types';
import { type VechainSDKError } from '@vechain/sdk-errors';

/**
 * Error logger internal function.
 */
const _logErrorFunction: LogFunctionType<'error'> = {
    log: <TErrorData>(error: VechainSDKError<TErrorData>) => {
        console.error(
            `\n****************** ERROR ON: %s ******************\n` +
                `- Error message: '%s'` +
                '\n- Error data:\n%o' +
                `\n- Internal error:\n%o\n`,
            error.methodName,
            error.errorMessage,
            error.data,
            error.innerError
        );
    }
};

export { _logErrorFunction };
