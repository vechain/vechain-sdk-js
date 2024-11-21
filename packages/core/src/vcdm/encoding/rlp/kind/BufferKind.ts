import { ScalarKind } from './ScalarKind';
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
     * @param {RLPInput} data The data to encode, expected to be of Uint8Array type.
     * @param {string} context Descriptive context for error messages
     * @returns {DataOutput} Object with an encode function.
     * @throws {InvalidRLP}
     */
    public data(data: RLPInput, context: string): DataOutput {
        // Ensure that the data is indeed a Buffer before encoding.
        // ArrayBuffer.isView so we support https://github.com/vitest-dev/vitest/issues/5183
        if (!ArrayBuffer.isView(data)) {
            throw new InvalidRLP(
                'BufferKind.data()',
                `Validation error: Expected a Uint8Array type in ${context}.`,
                {
                    context,
                    data: {
                        data
                    }
                }
            );
        }

        return {
            encode: () => data // Data is already a Buffer, so return as-is.
        };
    }

    /**
     * Decodes the input buffer.
     *
     * @param {Uint8Array} buffer - The buffer to decode, expected to be of buffer type.
     * @returns BufferOutput object with a decode function.
     * @throws {InvalidRLP}
     */
    public buffer(buffer: Uint8Array): BufferOutput {
        return {
            decode: () => buffer // Buffer is already in the correct format, so return as-is.
        };
    }
}

export { BufferKind };
