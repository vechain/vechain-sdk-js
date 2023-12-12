import { assert, DATA } from '@vechainfoundation/vechain-sdk-errors';
import { type ReturnType } from '../types';

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
 * Asserts that the return type of hash is valid.
 * @param returnType - The return type of the hash function
 */
function assertIsValidReturnType(returnType: ReturnType): void {
    assert(
        isValidReturnType(returnType),
        DATA.INVALID_DATA_RETURN_TYPE,
        "Validation error: Invalid Return type. Return type in hash function must be 'buffer' or 'hex'.",
        { returnType }
    );
}

export { assertIsValidReturnType };
