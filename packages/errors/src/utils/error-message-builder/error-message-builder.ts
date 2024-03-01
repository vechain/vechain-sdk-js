import type { DataType, ErrorCode } from '../../types';

/**
 * Function to stringify data correctly.
 * Some data types like Error, Map, Set, etc. are not stringified correctly by JSON.stringify.
 * This function handles those cases and avoid circular references.
 *
 * @param data - The data to be stringified.
 */
const stringifyData = (data: unknown): string => {
    /**
     * Function to avoid circular references when stringifying data.
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
 * Function to build an error message
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
        `\n-Internal error: \n\t${innerError?.message !== undefined ? innerError.message : 'No internal error given'}` +
        `\n-Parameters: \n\t${stringifyData(inputData)}`
    );
}

export { buildErrorMessage };
