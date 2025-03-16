import { Hex } from '../../../Hex';
import { type RLPInput } from '../types';
import { InvalidRLPEncodingError } from '../../../../errors';

/**
 * Full Qualified Path
 */
const FQP = 'vcdm.encoding.rlp.helpers.hexBlobKind!';

/**
 * Validates if the input is a proper hex string for HexBlobKind.
 *
 * @param data - The input data to validate.
 * @param context - Additional context for error handling.
 * @throws {InvalidRLPEncodingError} - If the operation fails.
 */
const assertValidHexBlobKindData = (data: RLPInput, context: string): void => {
    if (typeof data !== 'string') {
        throw new InvalidRLPEncodingError(
            `${FQP}assertValidHexBlobKindData(data, context): void`,
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
        throw new InvalidRLPEncodingError(
            `${FQP}assertValidHexBlobKindData(data, context): void`,
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
        throw new InvalidRLPEncodingError(
            `${FQP}assertValidHexBlobKindData(data, context): void`,
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

export { assertValidHexBlobKindData };
