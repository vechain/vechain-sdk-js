import { dataUtils } from '../../../utils';
import { type RLPInput } from '../types';
import { buildError, RLP } from '@vechainfoundation/errors';

/**
 * Validates if the input is a proper hex string for HexBlobKind.
 *
 * @throws{InvalidRLPError}
 * @param data - The input data to validate.
 * @param context - Additional context for error handling.
 */
const assertValidHexBlobKindData = (data: RLPInput, context: string): void => {
    if (typeof data !== 'string') {
        throw buildError(RLP.INVALID_RLP, 'expected string', { context });
    }

    // Check if data is a valid hex string with '0x' prefix.
    if (!dataUtils.isHexString(data, true)) {
        throw buildError(RLP.INVALID_RLP, 'expected hex string', { context });
    }

    // Ensure the hex string length is even.
    if (data.length % 2 !== 0) {
        throw buildError(RLP.INVALID_RLP, 'expected even length string', {
            context
        });
    }
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
    if (!Buffer.isBuffer(buffer)) {
        throw buildError(RLP.INVALID_RLP, 'expected buffer', { context });
    }
};

export { assertValidHexBlobKindData, assertValidHexBlobKindBuffer };
