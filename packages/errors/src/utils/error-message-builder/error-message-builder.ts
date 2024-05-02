import type { DataType, ErrorCode } from '../../types';

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
        return (key: string, value: unknown) => {
            if (typeof value === 'object' && value !== null) {
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
 * Builds an error message with the specified method name, error message, input data, and optional inner error.
 *
 * @param {string} methodName - The name of the method that failed.
 * @param {string} errorMessage - The specific reason for the failure.
 * @param {DataType} inputData - The input data used by the method.
 * @param {Error} [innerError] - An optional inner error that caused the failure.
 *
 * @return {string} - The built error message.
 *
 * @remarks
 * **IMPORTANT: no sensitive data should be passed as any parameter.**
 */
function buildErrorMessage<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(
    methodName: string,
    errorMessage: string,
    inputData: DataTypeT,
    innerError?: Error
): string {
    return (
        `Method '${methodName}' failed.` +
        `\n-Reason: '${errorMessage}'` +
        `\n-Parameters: \n\t${stringifyData(inputData)}` +
        `\n-Internal error: \n\t${innerError?.message !== undefined ? innerError.message : 'No internal error given'}`
    );
}

export { stringifyData, buildErrorMessage };
