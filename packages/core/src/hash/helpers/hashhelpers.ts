import { buildError, DATA, type ErrorType } from '@vechain-sdk/errors';

/**
 * Checks if the return type is valid
 *
 * Helper method needed to validate the return type of the hash function
 *
 * @param value - The return type
 * @returns A boolean indicating whether the return type is valid
 */
const isValidReturnType = (value: string): boolean => {
    return !(value !== 'buffer' && value !== 'hex');
};

/**
 * Create a context-aware error for invalid return type.
 * @returns An Error object tailored for invalid return type.
 */
const createInvalidReturnTypeError =
    (): ErrorType<DATA.INVALID_DATA_RETURN_TYPE> => {
        return buildError(
            DATA.INVALID_DATA_RETURN_TYPE,
            "Invalid return type. Return type should be either 'buffer' or 'hex'"
        );
    };

export { isValidReturnType, createInvalidReturnTypeError };
