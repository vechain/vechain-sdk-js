import { ERRORS } from '../../../utils';

/**
 * Encode a BigInt instance into a Buffer, ensuring it adheres to specific constraints.
 * @param bi - BigInt instance to encode.
 * @param maxBytes - Maximum byte length allowed for the encoding. If undefined, no byte size limit is imposed.
 * @param context - Contextual information for error messages.
 * @returns A Buffer instance containing the encoded data.
 * @throws Will throw an error if the encoded data exceeds the defined `maxBytes`.
 */
const encodeBigIntToBuffer = (
    bi: bigint,
    maxBytes: number | undefined,
    context: string
): Buffer => {
    if (bi === 0n) return Buffer.alloc(0);

    let hex = bi.toString(16);

    // Ensure hex string has an even length
    if (hex.length % 2 !== 0) {
        hex = '0' + hex;
    }

    if (maxBytes !== undefined && hex.length > maxBytes * 2) {
        throw createRlpError(context, `expected number in ${maxBytes} bytes`);
    }

    return Buffer.from(hex, 'hex');
};

/**
 * Decode a Buffer into a number or hexadecimal string.
 * @param buffer - Buffer instance to decode.
 * @returns A number if the decoded BigInt is a safe integer, otherwise returns a hexadecimal string.
 */
const decodeBufferToNumberOrHex = (buffer: Buffer): number | string => {
    if (buffer.length === 0) return 0;

    const bi = BigInt('0x' + buffer.toString('hex'));
    const num = Number(bi);

    // Return number or hex based on integer safety
    return Number.isSafeInteger(num) ? num : '0x' + bi.toString(16);
};

/**
 * Create a context-aware RLP error.
 * @param context - Contextual information for enhanced error detail.
 * @param message - Descriptive error message.
 * @returns An Error object tailored for RLP issues.
 */
const createRlpError = (context: string, message: string): Error => {
    return new Error(ERRORS.RLP.INVALID_RLP(context, message));
};

export { encodeBigIntToBuffer, decodeBufferToNumberOrHex, createRlpError };
