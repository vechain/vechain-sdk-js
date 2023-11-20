import { assert, DATA } from '@vechainfoundation/vechain-sdk-errors';
import { type ReturnType } from '../types';
import { isValidReturnType } from './hashhelpers';

/**
 * Asserts that the return type of hash is valid.
 * @param returnType - The return type of the hash function
 */
function assertIsValidReturnType(returnType: ReturnType): void {
    assert(
        isValidReturnType(returnType),
        DATA.INVALID_DATA_RETURN_TYPE,
        "Invalid return type. Return type should be either 'buffer' or 'hex'",
        { returnType }
    );
}

export { assertIsValidReturnType };
