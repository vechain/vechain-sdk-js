import { Hex0x } from '../../../utils';
import { type RLPInput } from '../types';
import { assert, RLP } from '@vechain/sdk-errors';

/**
 * Validates if the input is a proper hex string for HexBlobKind.
 *
 * @throws{InvalidRLPError}
 * @param data - The input data to validate.
 * @param context - Additional context for error handling.
 */
const assertValidHexBlobKindData = (data: RLPInput, context: string): void => {
    assert(
        'assertValidHexBlobKindData',
        typeof data === 'string',
        RLP.INVALID_RLP,
        'Validation error: Input must be a string.',
        {
            data,
            context
        }
    );

    // Check if data is a valid hex string with '0x' prefix.
    assert(
        'assertValidHexBlobKindData',
        Hex0x.isValid(data as string),
        RLP.INVALID_RLP,
        "Validation error: Input must be a valid hex string with a '0x' prefix.",
        { data, context }
    );

    // Ensure the hex string length is even.
    assert(
        'assertValidHexBlobKindData',
        (data as string).length % 2 === 0,
        RLP.INVALID_RLP,
        'Validation error: Hex string must have an even length.',
        { data, context }
    );
};

/**
 * Validates if the input buffer is valid for HexBlobKind.
 *
 * @throws{InvalidRLPError}
 * @param buffer - The buffer to validate.
 * @param context - Additional context for error handling.
 */
const assertValidHexBlobKindBuffer = (
    buffer: Buffer,
    context: string
): void => {
    assert(
        'assertValidHexBlobKindBuffer',
        Buffer.isBuffer(buffer),
        RLP.INVALID_RLP,
        'Validation error: Input must be a valid buffer.',
        {
            buffer,
            context
        }
    );
};

export { assertValidHexBlobKindData, assertValidHexBlobKindBuffer };
