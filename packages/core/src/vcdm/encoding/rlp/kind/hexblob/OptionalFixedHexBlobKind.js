"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalFixedHexBlobKind = void 0;
const FixedHexBlobKind_1 = require("./FixedHexBlobKind");
/**
 * Represents a fixed hex blob kind with optional data functionality.
 * This class extends the {@link FixedHexBlobKind} class.
 */
class OptionalFixedHexBlobKind extends FixedHexBlobKind_1.FixedHexBlobKind {
    /**
     * Encodes the input data (which can be null or undefined) into a Uint8Array.
     *
     * @param data - The data to encode, can be null or undefined.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Uint8Array.
     */
    data(data, context) {
        // If data is null or undefined, return an empty Uint8Array.
        return data == null
            ? {
                encode: () => Uint8Array.from([])
            }
            : super.data(data, context);
    }
    /**
     * Decodes the input buffer into a hex string or null if the buffer is empty.
     *
     * @param buffer - The buffer to decode, can be empty.
     * @param context - Context string for error handling.
     * @returns An object containing a decode function which returns the decoded hex string or null.
     */
    buffer(buffer, context) {
        return buffer.length === 0
            ? {
                decode: () => null
            }
            : super.buffer(buffer, context);
    }
}
exports.OptionalFixedHexBlobKind = OptionalFixedHexBlobKind;
