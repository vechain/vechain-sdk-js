import { ScalarKind } from './ScalarKind';
import { type BufferOutput, type DataOutput, type RLPInput } from '../types';
/**
 * Represents a scalar kind with numeric functionality.
 * This class extends the {@link ScalarKind} class.
 */
declare class NumericKind extends ScalarKind {
    readonly maxBytes?: number | undefined;
    /**
     * Constructs a new instance of NumericKind.
     *
     * @param maxBytes - Optional parameter that specifies the maximum number of bytes that numeric data can occupy when encoded.
     */
    constructor(maxBytes?: number | undefined);
    /**
     * Encodes the input data into numeric format and ensures it doesn't exceed the maximum bytes, if specified.
     *
     * @param data - The data to encode, expected to be numeric.
     * @param context - Descriptive context for error messages
     * @returns DataOutput object with an encode function.
     * @throws Will throw an error if data validation fails or encoding issues occur.
     */
    data(data: RLPInput, context: string): DataOutput;
    /**
     * Decodes the input buffer into a number or hexadecimal string, ensuring it meets numeric data constraints.
     *
     * @param {Uint8Array} buffer - The buffer to decode, containing numeric data.
     * @param context - Descriptive context for error messages.
     * @returns BufferOutput object with a decode function.
     * @throws Will throw an error if buffer validation fails.
     */
    buffer(buffer: Uint8Array, context: string): BufferOutput;
}
export { NumericKind };
//# sourceMappingURL=NumericKind.d.ts.map