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
    return JSON.stringify(data, getCircularReplacer());
};

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
        `\n-Internal error: \n\t${innerError?.message !== undefined ? innerError.message : 'No internal error given'}`
    );
}

export { createErrorMessage };
