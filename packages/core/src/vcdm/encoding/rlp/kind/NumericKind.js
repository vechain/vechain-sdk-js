"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericKind = void 0;
const ScalarKind_1 = require("./ScalarKind");
const helpers_1 = require("../helpers");
/**
 * Represents a scalar kind with numeric functionality.
 * This class extends the {@link ScalarKind} class.
 */
class NumericKind extends ScalarKind_1.ScalarKind {
    maxBytes;
    /**
     * Constructs a new instance of NumericKind.
     *
     * @param maxBytes - Optional parameter that specifies the maximum number of bytes that numeric data can occupy when encoded.
     */
    constructor(maxBytes) {
        super();
        this.maxBytes = maxBytes;
    }
    /**
     * Encodes the input data into numeric format and ensures it doesn't exceed the maximum bytes, if specified.
     *
     * @param data - The data to encode, expected to be numeric.
     * @param context - Descriptive context for error messages
     * @returns DataOutput object with an encode function.
     * @throws Will throw an error if data validation fails or encoding issues occur.
     */
    data(data, context) {
        // Validate and convert the numeric data to a BigInt instance.
        const dataBI = (0, helpers_1.validateNumericKindData)(data, context);
        return {
            encode: () => (0, helpers_1.encodeBigIntToBuffer)(dataBI, this.maxBytes, context) // Encodes BigInt to Buffer, respecting maxBytes.
        };
    }
    /**
     * Decodes the input buffer into a number or hexadecimal string, ensuring it meets numeric data constraints.
     *
     * @param {Uint8Array} buffer - The buffer to decode, containing numeric data.
     * @param context - Descriptive context for error messages.
     * @returns BufferOutput object with a decode function.
     * @throws Will throw an error if buffer validation fails.
     */
    buffer(buffer, context) {
        // Ensure the buffer adheres to constraints related to numeric data.
        (0, helpers_1.assertValidNumericKindBuffer)(buffer, context, this.maxBytes);
        return {
            decode: () => (0, helpers_1.decodeBufferToNumberOrHex)(buffer) // Decodes buffer to either a number or a hexadecimal string.
        };
    }
}
exports.NumericKind = NumericKind;
