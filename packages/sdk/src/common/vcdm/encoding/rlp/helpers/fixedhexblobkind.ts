import { InvalidEncodingError } from '@common/errors';

/**
 * Full Qualified Path
 */
const FQP =
    'packages/sdk/src/common/vcdm/encoding/rlp/helpers/fixedHexBlobKind!';

/**
 * Asserts that the data is a hex string of the correct length.
 *
 * @param data - The data to validate.
 * @param context - Descriptive context for error messages.
 * @param bytes - The expected number of bytes that the data can contain.
 * @throws {InvalidEncodingError} - If the operation fails.
 */
const assertFixedHexBlobKindData = (
    data: string,
    context: string,
    bytes: number
): void => {
    if (data.length !== bytes * 2 + 2) {
        throw new InvalidEncodingError(
            `${FQP}assertFixedHexBlobKindData(data, context, bytes): void`,
            `Validation error: Hex string in ${context} must be exactly ${bytes} bytes in length.`,
            {
                context,
                data: {
                    data,
                    bytes
                }
            }
        );
    }
};

/**
 * Asserts that the buffer is of a specific length.
 *
 * @param {Uint8Array} buffer The buffer to validate.
 * @param {string} context Descriptive context for error messages.
 * @param {number} bytes The expected number of bytes that the buffer can contain.
 * @throws {InvalidEncodingError} - If the operation fails.
 */
const assertFixedHexBlobKindBuffer = (
    buffer: Uint8Array,
    context: string,
    bytes: number
): void => {
    if (buffer.length !== bytes) {
        throw new InvalidEncodingError(
            `${FQP}assertFixedHexBlobKindBuffer(buffer, context, bytes): void`,
            `Validation error: Hex string in ${context} must be exactly ${bytes} bytes in length.`,
            {
                context,
                data: {
                    buffer,
                    bytes
                }
            }
        );
    }
};

export { assertFixedHexBlobKindData, assertFixedHexBlobKindBuffer };
