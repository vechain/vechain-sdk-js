import { dataUtils } from '../../../utils';
import { type RLPInput } from '../types';
import { assertInput, RLP } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Validates if the input is a proper hex string for HexBlobKind.
 *
 * @throws{InvalidRLPError}
 * @param data - The input data to validate.
 * @param context - Additional context for error handling.
 */
const assertValidHexBlobKindData = (data: RLPInput, context: string): void => {
    assertInput(typeof data === 'string', RLP.INVALID_RLP, 'expected string', {
        data,
        context
    });

    // Check if data is a valid hex string with '0x' prefix.
    assertInput(
        dataUtils.isHexString(data as string, true),
        RLP.INVALID_RLP,
        'expected hex string',
        { data, context }
    );

    // Ensure the hex string length is even.
    assertInput(
        (data as string).length % 2 === 0,
        RLP.INVALID_RLP,
        'expected even length string',
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
    assertInput(Buffer.isBuffer(buffer), RLP.INVALID_RLP, 'expected buffer', {
        buffer,
        context
    });
};

export { assertValidHexBlobKindData, assertValidHexBlobKindBuffer };
