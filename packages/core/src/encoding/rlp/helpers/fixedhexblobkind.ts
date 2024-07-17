import { InvalidRLP } from '@vechain/sdk-errors';

/**
 * Asserts that the data is a hex string of the correct length.
 *
 * @throws{InvalidRLP} Will throw an error with a message containing the context if the data length is not equal to the specified bytes.
 * @param data - The data to validate.
 * @param context - Descriptive context for error messages.
 * @param bytes - The expected number of bytes that the data can contain.
 */
const assertFixedHexBlobKindData = (
    data: string,
    context: string,
    bytes: number
): void => {
    if (data.length !== bytes * 2 + 2) {
        throw new InvalidRLP(
            'assertFixedHexBlobKindData()',
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
 * @throws{InvalidRLP} - Will throw an error with a message containing the context if the buffer length is not equal to the specified bytes.
 * @param buffer - The buffer to validate.
 * @param context - Descriptive context for error messages.
 * @param bytes - The expected number of bytes that the buffer can contain.
 *
 */
const assertFixedHexBlobKindBuffer = (
    buffer: Buffer,
    context: string,
    bytes: number
): void => {
    if (buffer.length !== bytes) {
        throw new InvalidRLP(
            'assertFixedHexBlobKindData()',
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
