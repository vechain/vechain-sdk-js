import { type BufferOutput, type DataOutput, type RLPInput } from '../../types';
import { HexBlobKind } from './HexBlobKind';
/**
 * Represents a hex blob kind with fixed bytes size functionality.
 * This class extends the {@link HexBlobKind} class.
 */
declare class FixedHexBlobKind extends HexBlobKind {
    readonly bytes: number;
    /**
     * Creates a new instance of the {@link FixedHexBlobKind} class.
     * @param bytes - The number of bytes the blob must have.
     */
    constructor(bytes: number);
    /**
     * Encodes the input data into a Uint8Array with validation against fixed size.
     *
     * @param data - The data to encode, expected to be a '0x' prefixed even sized hex string.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Uint8Array.
     */
    data(data: RLPInput, context: string): DataOutput;
    /**
     * Decodes the input buffer into a hex string with validation against fixed size.
     *
     * @param buffer - The buffer to decode.
     * @param context - Context string for error handling.
     * @returns An object containing a decode function which returns the decoded hex string.
     */
    buffer(buffer: Uint8Array, context: string): BufferOutput;
}
export { FixedHexBlobKind };
//# sourceMappingURL=FixedHexBlobKind.d.ts.map