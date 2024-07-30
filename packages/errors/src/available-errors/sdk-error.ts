import { assertInnerError, createErrorMessage } from '../helpers';

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
            createErrorMessage(
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

export { VechainSDKError };
