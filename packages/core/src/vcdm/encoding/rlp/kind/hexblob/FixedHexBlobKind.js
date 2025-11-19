"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedHexBlobKind = void 0;
const helpers_1 = require("../../helpers");
const HexBlobKind_1 = require("./HexBlobKind");
/**
 * Represents a hex blob kind with fixed bytes size functionality.
 * This class extends the {@link HexBlobKind} class.
 */
class FixedHexBlobKind extends HexBlobKind_1.HexBlobKind {
    bytes;
    /**
     * Creates a new instance of the {@link FixedHexBlobKind} class.
     * @param bytes - The number of bytes the blob must have.
     */
    constructor(bytes) {
        super();
        this.bytes = bytes;
    }
    /**
     * Encodes the input data into a Uint8Array with validation against fixed size.
     *
     * @param data - The data to encode, expected to be a '0x' prefixed even sized hex string.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Uint8Array.
     */
    data(data, context) {
        const encoder = super.data(data, context);
        // Validate the data length against the fixed size. `typeof data === 'string'` is checked in super.data
        (0, helpers_1.assertFixedHexBlobKindData)(data, context, this.bytes);
        return encoder;
    }
    /**
     * Decodes the input buffer into a hex string with validation against fixed size.
     *
     * @param buffer - The buffer to decode.
     * @param context - Context string for error handling.
     * @returns An object containing a decode function which returns the decoded hex string.
     */
    buffer(buffer, context) {
        const decoder = super.buffer(buffer, context);
        // Validate the buffer length against the fixed size.
        (0, helpers_1.assertFixedHexBlobKindBuffer)(buffer, context, this.bytes);
        return decoder;
    }
}
exports.FixedHexBlobKind = FixedHexBlobKind;
