import { type BufferOutput, type DataOutput, type RLPInput } from '../../types';
import { FixedHexBlobKind } from './fixedhexblob';

/**
 * Represents a fixed hex blob kind with optional data functionality.
 * This class extends the {@link FixedHexBlobKind} class.
 */
class OptionalFixedHexBlobKind extends FixedHexBlobKind {
    /**
     * Encodes the input data (which can be null or undefined) into a Buffer.
     *
     * @param data - The data to encode, can be null or undefined.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Buffer.
     */
    public data(data: RLPInput, context: string): DataOutput {
        // If data is null or undefined, return an empty Buffer.
        return data == null
            ? {
                  encode: () => Buffer.alloc(0)
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
    public buffer(buffer: Buffer, context: string): BufferOutput {
        return buffer.length === 0
            ? {
                  decode: () => null
              }
            : super.buffer(buffer, context);
    }
}

export { OptionalFixedHexBlobKind };
