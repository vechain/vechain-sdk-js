import { ScalarKind } from './ScalarKind';
import { type BufferOutput, type DataOutput, type RLPInput } from '../types';
/**
 * Represents a scalar kind with Buffer functionality.
 * This class extends the {@link ScalarKind} class.
 */
declare class BufferKind extends ScalarKind {
    /**
     * Encodes the input data into buffer format.
     *
     * @param {RLPInput} data The data to encode, expected to be of Uint8Array type.
     * @param {string} context Descriptive context for error messages
     * @returns {DataOutput} Object with an encode function.
     * @throws {InvalidRLP}
     */
    data(data: RLPInput, context: string): DataOutput;
    /**
     * Decodes the input buffer.
     *
     * @param {Uint8Array} buffer - The buffer to decode, expected to be of buffer type.
     * @returns BufferOutput object with a decode function.
     * @throws {InvalidRLP}
     */
    buffer(buffer: Uint8Array): BufferOutput;
}
export { BufferKind };
//# sourceMappingURL=BufferKind.d.ts.map