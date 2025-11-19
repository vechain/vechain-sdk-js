"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeCompactFixedHexBlob = exports.decodeBufferToHexWithLeadingZeros = exports.assertCompactFixedHexBlobBuffer = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const Hex_1 = require("../../../Hex");
/**
 * Asserts that the provided buffer is of a specific length and does not contain leading zeros.
 *
 * @param {Uint8Array} buffer - The buffer to validate.
 * @param {string} context - Descriptive context for error messages, usually representing the caller's identity.
 * @param {number} bytes - The expected maximum number of bytes that the buffer can contain.
 * @throws {InvalidRLP}
 */
const assertCompactFixedHexBlobBuffer = (buffer, context, bytes) => {
    if (buffer.length > bytes) {
        throw new sdk_errors_1.InvalidRLP('assertCompactFixedHexBlobBuffer()', `Validation error: Buffer in ${context} must be at most ${bytes} bytes.`, {
            context,
            data: {
                buffer,
                bytes
            }
        });
    }
    if (buffer.length !== 0 && buffer[0] === 0) {
        throw new sdk_errors_1.InvalidRLP('assertCompactFixedHexBlobBuffer()', `Validation error: Buffer in ${context} should not have leading zero bytes.`, {
            context,
            data: {
                buffer,
                bytes
            }
        });
    }
};
exports.assertCompactFixedHexBlobBuffer = assertCompactFixedHexBlobBuffer;
/**
 * Encodes a buffer by trimming leading zero bytes.
 * Finds the first non-zero byte and returns a new buffer starting from that byte. Returns an empty buffer if all bytes are zero.
 *
 * @param {Uint8Array} buffer - The buffer to be compacted.
 * @returns {Uint8Array} A Uint8Array instance compacted of leading zero bytes, or an empty Uint8Array if all bytes are zero.
 */
const encodeCompactFixedHexBlob = (buffer) => {
    const zeroIndex = buffer.findIndex((byte) => byte !== 0);
    return zeroIndex !== -1 ? buffer.subarray(zeroIndex) : Uint8Array.from([]);
};
exports.encodeCompactFixedHexBlob = encodeCompactFixedHexBlob;
/**
 * Decodes a buffer into a hexadecimal string, ensuring a specific total byte length by prepending zeros if necessary.
 * Calculates the number of missing bytes compared to the expected total and prepends the corresponding number of '0' characters to the hexadecimal string representation of the buffer.
 *
 * @param {Uint8Array} buffer The buffer to decode.
 * @param {number} bytes The expected total number of bytes in the final hexadecimal string (including leading zeros).
 * @returns A hexadecimal string with the necessary leading '0' characters to ensure the specified total byte length.
 */
const decodeBufferToHexWithLeadingZeros = (buffer, bytes) => {
    return Hex_1.Hex.of(buffer)
        .fit(bytes * 2)
        .toString();
};
exports.decodeBufferToHexWithLeadingZeros = decodeBufferToHexWithLeadingZeros;
