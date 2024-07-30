import type { LogFunctionType } from '../types';
import { type VechainSDKError } from '@vechain/sdk-errors';

/**
 * Error logger internal function.
 */
const _logErrorFunction: LogFunctionType<'error'> = {
    log: <TErrorData>(error: VechainSDKError<TErrorData>) => {
        console.error(
            `\n****************** ERROR ON: ${error.methodName} ******************\n` +
                `- Error message: '${error.errorMessage}'` +
                '\n- Error data:\n',
            error.data,
            `\n- Internal error:\n`,
            error.innerError,
            `\n`
        );
    }
};

export { _logErrorFunction };
