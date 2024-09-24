import {
    assertFixedHexBlobKindBuffer,
    assertFixedHexBlobKindData
} from '../../helpers';
import { type BufferOutput, type DataOutput, type RLPInput } from '../../types';
import { HexBlobKind } from './hexblob';

/**
 * Represents a hex blob kind with fixed bytes size functionality.
 * This class extends the {@link HexBlobKind} class.
 */
class FixedHexBlobKind extends HexBlobKind {
    /**
     * Creates a new instance of the {@link FixedHexBlobKind} class.
     * @param bytes - The number of bytes the blob must have.
     */
    constructor(readonly bytes: number) {
        super();
    }

    /**
     * Encodes the input data into a Buffer with validation against fixed size.
     *
     * @param data - The data to encode, expected to be a '0x' prefixed even sized hex string.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Buffer.
     */
    public data(data: RLPInput, context: string): DataOutput {
        const encoder = super.data(data, context);

        // Validate the data length against the fixed size. `typeof data === 'string'` is checked in super.data
        assertFixedHexBlobKindData(data as string, context, this.bytes);

        return encoder;
    }

    /**
     * Decodes the input buffer into a hex string with validation against fixed size.
     *
     * @param buffer - The buffer to decode.
     * @param context - Context string for error handling.
     * @returns An object containing a decode function which returns the decoded hex string.
     */
    public buffer(buffer: Buffer, context: string): BufferOutput {
        const decoder = super.buffer(buffer, context);

        // Validate the buffer length against the fixed size.
        assertFixedHexBlobKindBuffer(buffer, context, this.bytes);

        return decoder;
    }
}

export { FixedHexBlobKind };
