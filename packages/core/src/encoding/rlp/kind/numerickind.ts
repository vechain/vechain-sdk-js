import { ScalarKind } from './scalarkind.abstract';
import {
    assertValidNumericKindBuffer,
    decodeBufferToNumberOrHex,
    encodeBigIntToBuffer,
    validateNumericKindData
} from '../helpers';
import { type BufferOutput, type DataOutput, type RLPInput } from '../types';

/**
 * Represents a scalar kind with numeric functionality.
 * This class extends the {@link ScalarKind} class.
 */
class NumericKind extends ScalarKind {
    /**
     * Constructs a new instance of NumericKind.
     *
     * @param maxBytes - Optional parameter that specifies the maximum number of bytes that numeric data can occupy when encoded.
     */
    constructor(readonly maxBytes?: number) {
        super();
    }

    /**
     * Encodes the input data into numeric format and ensures it doesn't exceed the maximum bytes, if specified.
     *
     * @param data - The data to encode, expected to be numeric.
     * @param context - Descriptive context for error messages
     * @returns DataOutput object with an encode function.
     * @throws Will throw an error if data validation fails or encoding issues occur.
     */
    public data(data: RLPInput, context: string): DataOutput {
        // Validate and convert the numeric data to a BigInt instance.
        const dataBI = validateNumericKindData(data, context);

        return {
            encode: () => encodeBigIntToBuffer(dataBI, this.maxBytes, context) // Encodes BigInt to Buffer, respecting maxBytes.
        };
    }

    /**
     * Decodes the input buffer into a number or hexadecimal string, ensuring it meets numeric data constraints.
     *
     * @param buffer - The buffer to decode, containing numeric data.
     * @param context - Descriptive context for error messages.
     * @returns BufferOutput object with a decode function.
     * @throws Will throw an error if buffer validation fails.
     */
    public buffer(buffer: Buffer, context: string): BufferOutput {
        // Ensure the buffer adheres to constraints related to numeric data.
        assertValidNumericKindBuffer(buffer, context, this.maxBytes);

        return {
            decode: () => decodeBufferToNumberOrHex(buffer) // Decodes buffer to either a number or a hexadecimal string.
        };
    }
}

export { NumericKind };
