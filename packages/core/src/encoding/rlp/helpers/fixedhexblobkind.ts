import { assert, RLP } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Asserts that the data is a hex string of the correct length.
 *
 * @throws{InvalidRLPError} Will throw an error with a message containing the context if the data length is not equal to the specified bytes.
 * @param data - The data to validate.
 * @param context - Descriptive context for error messages.
 * @param bytes - The expected number of bytes that the data can contain.
 */
const assertFixedHexBlobKindData = (
    data: string,
    context: string,
    bytes: number
): void => {
    assert(
        data.length === bytes * 2 + 2,
        RLP.INVALID_RLP,
        `expected hex string to be ${bytes} bytes`,
        { data, context }
    );
};

/**
 * Asserts that the buffer is of a specific length.
 *
 * @throws{InvalidRLPError} - Will throw an error with a message containing the context if the buffer length is not equal to the specified bytes.
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
    assert(
        buffer.length === bytes,
        RLP.INVALID_RLP,
        `expected buffer to be ${bytes} bytes`,
        { buffer, context }
    );
};

export { assertFixedHexBlobKindData, assertFixedHexBlobKindBuffer };
