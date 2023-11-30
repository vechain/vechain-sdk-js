import {
    assert,
    RLP as RLPError,
    RLP
} from '@vechainfoundation/vechain-sdk-errors';
import { type RLPInput } from '../types';

/**
 * Asserts that the data is a buffer.
 *
 * @param bufferToCheck - The bufferToCheck to validate.
 * @param context - Descriptive context for error messages.
 *
 * @throws{InvalidRLPError}
 */
function assertIsValidBuffer(
    bufferToCheck: Buffer | RLPInput,
    context: string
): void {
    assert(Buffer.isBuffer(bufferToCheck), RLP.INVALID_RLP, 'expected buffer', {
        bufferToCheck,
        context
    });
}

/**
 * Asserts that the data is an array.
 *
 * @param arrayToCheck - The arrayToCheck to validate.
 * @param context - Descriptive context for error messages.
 *
 * @throws{InvalidRLPError}
 */
function assertIsArray<ArrayType>(
    arrayToCheck: ArrayType,
    context: string
): void {
    assert(
        Array.isArray(arrayToCheck),
        RLPError.INVALID_RLP,
        'expected array',
        {
            context
        }
    );
}

export { assertIsValidBuffer, assertIsArray };
