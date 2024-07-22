import { ScalarKind } from './scalarkind.abstract';
import { type BufferOutput, type DataOutput, type RLPInput } from '../types';
import { InvalidRLP } from '@vechain/sdk-errors';

/**
 * Represents a scalar kind with Buffer functionality.
 * This class extends the {@link ScalarKind} class.
 */
class BufferKind extends ScalarKind {
    /**
     * Encodes the input data into buffer format.
     *
     * @param data - The data to encode, expected to be of buffer type.
     * @param context - Descriptive context for error messages
     * @returns DataOutput object with an encode function.
     * @throws {InvalidRLP}
     */
    public data(data: RLPInput, context: string): DataOutput {
        // Ensure that the data is indeed a Buffer before encoding.
        if (!Buffer.isBuffer(data))
            throw new InvalidRLP(
                'BufferKind.data()',
                `Validation error: Expected a Buffer type in ${context}.`,
                {
                    context,
                    data: {
                        data
                    }
                }
            );

        return {
            encode: () => data // Data is already a Buffer, so return as-is.
        };
    }

    /**
     * Decodes the input buffer.
     *
     * @param buffer - The buffer to decode, expected to be of buffer type.
     * @param context - Descriptive context for error messages, usually representing the caller's identity.
     * @returns BufferOutput object with a decode function.
     * @throws {InvalidRLP}
     */
    public buffer(buffer: Buffer, context: string): BufferOutput {
        // Ensure that the data is indeed a Buffer before encoding.
        if (!Buffer.isBuffer(buffer))
            throw new InvalidRLP(
                'BufferKind.buffer()',
                `Validation error: Expected a Buffer type in ${context}.`,
                {
                    context,
                    data: {
                        buffer
                    }
                }
            );

        return {
            decode: () => buffer // Buffer is already in the correct format, so return as-is.
        };
    }
}

export { BufferKind };
