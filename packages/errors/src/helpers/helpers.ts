/**
 * Function to stringify data correctly.
 * Some data types like Error, Map, Set, etc. are not stringified correctly by JSON.stringify.
 * This function handles those cases and avoid circular references.
 *
 * @param data - The data to be stringified.
 * @returns The stringified data.
 */
const stringifyData = (data: unknown): string => {
    /**
     * Function to avoid circular references when stringify data.
     */
    const getCircularReplacer = (): ((
        key: string,
        value: unknown
    ) => unknown) => {
        const seen = new WeakSet();
        return (_key: string, value: unknown) => {
            if (typeof value === 'object' && value !== null && _key !== '') {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };

    // Return the stringified data
    return JSON.stringify(data, getCircularReplacer(), 2);
};

/**
 * Asserts that the given error is an instance of the Error class.
 * If the error is an instance of Error, it is returned.
 * If the error is not an instance of Error, a new Error object is created with a descriptive message.
 *
 * @param {unknown} error - The error to be asserted.
 * @return {Error} - The error if it is an instance of Error, or a new Error object if it is not.
 *
 * @remarks
 * **IMPORTANT: no sensitive data should be passed as any parameter.**
 */
function assertInnerError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    return new Error(
        `Inner error is not an instance of Error. Object:\n\t${stringifyData(error)}`
    );
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
function createErrorMessage<TErrorDataType>(
    methodName: string,
    errorMessage: string,
    inputData: TErrorDataType,
    innerError?: Error
): string {
    return (
        `Method '${methodName}' failed.` +
        `\n-Reason: '${errorMessage}'` +
        `\n-Parameters: \n\t${stringifyData(inputData)}` +
        `${innerError?.message !== undefined ? `\n-Internal error: \n\t${innerError.message}` : ''}`
    );
}

export { stringifyData, assertInnerError, createErrorMessage };
