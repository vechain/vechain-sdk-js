import { dataUtils } from '../../../utils';
import { type RLPInput } from '../types';
import { createRlpError } from './profiles';

/**
 * Validates if the input is a proper hex string for HexBlobKind.
 *
 * @param data - The input data to validate.
 * @param context - Additional context for error handling.
 * @throws Will throw an error if data is not a valid hex string.
 */
const assertValidHexBlobKindData = (data: RLPInput, context: string): void => {
    if (typeof data !== 'string') {
        throw createRlpError(context, 'expected string');
    }

    // Check if data is a valid hex string with '0x' prefix.
    if (!dataUtils.isHexString(data, true)) {
        throw createRlpError(context, 'expected hex string');
    }

    // Ensure the hex string length is even.
    if (data.length % 2 !== 0) {
        throw createRlpError(context, 'expected even length string');
    }
};

/**
 * Validates if the input buffer is valid for HexBlobKind.
 *
 * @param buffer - The buffer to validate.
 * @param context - Additional context for error handling.
 * @throws Will throw an error if buffer is not a Buffer instance.
 */
const assertValidHexBlobKindBuffer = (
    buffer: Buffer,
    context: string
): void => {
    if (!Buffer.isBuffer(buffer)) {
        throw createRlpError(context, 'expected buffer');
    }
};

export { assertValidHexBlobKindData, assertValidHexBlobKindBuffer };
