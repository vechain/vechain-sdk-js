import { Hex } from '../../../vcdm/Hex';
import { InvalidRLP } from '@vechain/sdk-errors';
import { type RLPInput } from '../types';

/**
 * Validates if the input is a proper hex string for HexBlobKind.
 *
 * @param data - The input data to validate.
 * @param context - Additional context for error handling.
 * @throws {InvalidRLP}
 */
const assertValidHexBlobKindData = (data: RLPInput, context: string): void => {
    if (typeof data !== 'string') {
        throw new InvalidRLP(
            'assertValidHexBlobKindData()',
            `Validation error: Input must be a string.`,
            {
                context,
                data: {
                    data
                }
            }
        );
    }

    // Check if data is a valid hex string with '0x' prefix.
    if (!Hex.isValid(data)) {
        throw new InvalidRLP(
            'assertValidHexBlobKindData()',
            `Validation error: Input must be a valid hex string with a '0x' prefix.`,
            {
                context,
                data: {
                    data
                }
            }
        );
    }

    // Ensure the hex string length is even.
    if (data.length % 2 !== 0) {
        throw new InvalidRLP(
            'assertValidHexBlobKindData()',
            `Validation error: Hex string must have an even length.`,
            {
                context,
                data: {
                    data
                }
            }
        );
    }
};

/**
 * Validates if the input buffer is valid for HexBlobKind.
 *
 * @param buffer - The buffer to validate.
 * @param context - Additional context for error handling.
 * @throws {InvalidRLP}
 */
const assertValidHexBlobKindBuffer = (
    buffer: Buffer,
    context: string
): void => {
    if (!Buffer.isBuffer(buffer)) {
        throw new InvalidRLP(
            'assertFixedHexBlobKindData()',
            `Validation error: Input must be a valid buffer.`,
            {
                context,
                data: {
                    buffer
                }
            }
        );
    }
};

export { assertValidHexBlobKindData, assertValidHexBlobKindBuffer };
