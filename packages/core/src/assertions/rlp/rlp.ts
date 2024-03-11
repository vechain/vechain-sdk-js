import { assert, RLP as RLPError, RLP } from '@vechain/sdk-errors';
import { type RLPInput } from '../../encoding';

/**
 * Asserts that the data is a buffer.
 *
 * @param methodName - The name of the method calling this assertion.
 * @param bufferToCheck - The bufferToCheck to validate.
 * @param context - Descriptive context for error messages.
 *
 * @throws{InvalidRLPError}
 */
function assertIsValidBuffer(
    methodName: string,
    bufferToCheck: Buffer | RLPInput,
    context: string
): void {
    assert(
        `assertIsValidBuffer - ${methodName}`,
        Buffer.isBuffer(bufferToCheck),
        RLP.INVALID_RLP,
        `Validation error: Expected a Buffer type in ${context}.`,
        {
            bufferToCheck,
            context
        }
    );
}

/**
 * Asserts that the data is an array.
 *
 * @param methodName - The name of the method calling this assertion.
 * @param arrayToCheck - The arrayToCheck to validate.
 * @param context - Descriptive context for error messages.
 *
 * @throws{InvalidRLPError}
 */
function assertIsArray<ArrayType>(
    methodName: string,
    arrayToCheck: ArrayType,
    context: string
): void {
    assert(
        `assertIsArray - ${methodName}`,
        Array.isArray(arrayToCheck),
        RLPError.INVALID_RLP,
        `Validation error: Expected an array in ${context}.`,
        {
            context
        }
    );
}

export { assertIsValidBuffer, assertIsArray };
