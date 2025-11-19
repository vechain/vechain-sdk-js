import { type RLPInput } from '../types';
/**
 * Validates and converts the input data to a BigInt.
 *
 * @param data - Either a number or a string representing a non-negative integer.
 * @param context - A string representing the context in which this function is used,
 *                 to create meaningful error messages.
 * @returns The input data converted to a BigInt.
 * @throws {InvalidRLP}
 */
declare const validateNumericKindData: (data: RLPInput, context: string) => bigint;
/**
 * Validates a buffer to ensure it adheres to constraints and does not contain
 * leading zero bytes which are not canonical representation in integers.
 *
 * @param {Uint8Array} buf - The buffer to validate.
 * @param {string} context - A string providing context for error messages.
 * @param {number} maxBytes - [Optional] An integer representing the maximum allowed length
 *                   of the buffer. If provided, an error will be thrown if buf is longer.
 * @throws {InvalidRLP}
 *
 * @private
 */
declare const assertValidNumericKindBuffer: (buf: Uint8Array, context: string, maxBytes?: number) => void;
/**
 * Encode a BigInt instance into a Buffer, ensuring it adheres to specific constraints.
 *
 * @param {bigint} bi - BigInt instance to encode.
 * @param {number | undefined} maxBytes - Maximum byte length allowed for the encoding. If undefined, no byte size limit is imposed.
 * @param {string} context - Contextual information for error messages.
 * @returns {Uint8Array} Encoded data.
 * @throws {InvalidRLP}
 */
declare const encodeBigIntToBuffer: (bi: bigint, maxBytes: number | undefined, context: string) => Uint8Array;
/**
 * Decode a Uint8Array into a number or hexadecimal string.
 * @param {Uint8Array} buffer - Instance to decode.
 * @returns A number if the decoded BigInt is a safe integer, otherwise returns a hexadecimal string.
 */
declare const decodeBufferToNumberOrHex: (buffer: Uint8Array) => number | string;
export { assertValidNumericKindBuffer, decodeBufferToNumberOrHex, encodeBigIntToBuffer, validateNumericKindData };
//# sourceMappingURL=numerickind.d.ts.map