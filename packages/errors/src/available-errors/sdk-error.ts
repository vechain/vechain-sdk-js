import { assertInnerError, stringifyData } from '../utils';

/**
 * Generic error class for SDK errors.
 *
 * Each error of SDK should extend this class.
 * And, then, error must redefine properly the TErrorDataType generic type.
 * In this way, the error will have a specific data type.
 */
class VechainSDKError<TErrorDataType> extends Error {
    constructor(
        readonly methodName: string,
        readonly errorMessage: string,
        readonly data: TErrorDataType,
        readonly innerError?: unknown
    ) {
        super(
            buildErrorMessage(
                methodName,
                errorMessage,
                data,
                innerError === undefined
                    ? undefined
                    : assertInnerError(innerError)
            )
        );
    }
}

/**
 * Function to build the error message.
 * Here, we can customize the error message format.
 *
 * @param methodName The name of the method that failed.
 * @param errorMessage The error message.
 * @param inputData The input data that caused the error.
 * @param innerError The inner error that caused the error.
 * @returns The error message as a string.
 */
function buildErrorMessage<TErrorDataType>(
    methodName: string,
    errorMessage: string,
    inputData: TErrorDataType,
    innerError?: Error
): string {
    return (
        `Method '${methodName}' failed.` +
        `\n-Reason: '${errorMessage}'` +
        `\n-Parameters: \n\t${stringifyData(inputData)}` +
        `\n-Internal error: \n\t${innerError?.message !== undefined ? innerError.message : 'No internal error given'}`
    );
}

export { VechainSDKError };
