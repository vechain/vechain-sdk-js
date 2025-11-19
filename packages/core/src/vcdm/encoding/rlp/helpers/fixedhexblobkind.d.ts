/**
 * Asserts that the data is a hex string of the correct length.
 *
 * @param data - The data to validate.
 * @param context - Descriptive context for error messages.
 * @param bytes - The expected number of bytes that the data can contain.
 * @throws {InvalidRLP}
 */
declare const assertFixedHexBlobKindData: (data: string, context: string, bytes: number) => void;
/**
 * Asserts that the buffer is of a specific length.
 *
 * @param {Uint8Array} buffer The buffer to validate.
 * @param {string} context Descriptive context for error messages.
 * @param {number} bytes The expected number of bytes that the buffer can contain.
 * @throws {InvalidRLP}
 */
declare const assertFixedHexBlobKindBuffer: (buffer: Uint8Array, context: string, bytes: number) => void;
export { assertFixedHexBlobKindData, assertFixedHexBlobKindBuffer };
//# sourceMappingURL=fixedhexblobkind.d.ts.map