import { createRlpError } from './profiles';

/**
 * Asserts that the data is a hex string of the correct length.
 *
 * @param data - The data to validate.
 * @param context - Descriptive context for error messages.
 * @param bytes - The expected number of bytes that the data can contain.
 * @throws Will throw an error with a message containing the context if the data length is not equal to the specified bytes.
 */
const assertFixedHexBlobKindData = (
    data: string,
    context: string,
    bytes: number
): void => {
    if (data.length !== bytes * 2 + 2)
        throw createRlpError(
            context,
            `expected hex string to be ${bytes} bytes`
        );
};

/**
 * Asserts that the buffer is of a specific length.
 * @param buffer - The buffer to validate.
 * @param context - Descriptive context for error messages.
 * @param bytes - The expected number of bytes that the buffer can contain.
 *
 * @throws Will throw an error with a message containing the context if the buffer length is not equal to the specified bytes.
 */
const assertFixedHexBlobKindBuffer = (
    buffer: Buffer,
    context: string,
    bytes: number
): void => {
    if (buffer.length !== bytes)
        throw createRlpError(context, `expected buffer to be ${bytes} bytes`);
};

export { assertFixedHexBlobKindData, assertFixedHexBlobKindBuffer };
