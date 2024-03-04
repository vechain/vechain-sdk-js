import { ScalarKind } from './scalarkind.abstract';
import { type BufferOutput, type DataOutput, type RLPInput } from '../types';
import { assertIsValidBuffer } from '../../../assertions';

/**
 * Represents a scalar kind with Buffer functionality.
 * This class extends the {@link ScalarKind} class.
 */
class BufferKind extends ScalarKind {
    /**
     * Encodes the input data into buffer format.
     *
     * @throws{InvalidRLPError}
     * @param data - The data to encode, expected to be of buffer type.
     * @param context - Descriptive context for error messages
     * @returns DataOutput object with an encode function.
     */
    public data(data: RLPInput, context: string): DataOutput {
        // Ensure that the data is indeed a Buffer before encoding.
        assertIsValidBuffer('data', data, context);

        return {
            encode: () => data as Buffer // Data is already a Buffer, so return as-is.
        };
    }

    /**
     * Decodes the input buffer.
     *
     * @throws{InvalidRLPError}
     * @param buffer - The buffer to decode, expected to be of buffer type.
     * @param context - Descriptive context for error messages, usually representing the caller's identity.
     * @returns BufferOutput object with a decode function.
     */
    public buffer(buffer: Buffer, context: string): BufferOutput {
        // Ensure that the provided parameter is indeed a Buffer before decoding.
        assertIsValidBuffer('buffer', buffer, context);

        return {
            decode: () => buffer // Buffer is already in the correct format, so return as-is.
        };
    }
}

export { BufferKind };
