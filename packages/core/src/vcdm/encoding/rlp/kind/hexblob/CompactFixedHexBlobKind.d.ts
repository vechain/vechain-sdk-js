import { type BufferOutput, type DataOutput, type RLPInput } from '../../types';
import { FixedHexBlobKind } from './FixedHexBlobKind';
/**
 * Represents a fixed hex blob kind with zero trimming and padding functionality.
 * This class extends the {@link FixedHexBlobKind} class.
 */
declare class CompactFixedHexBlobKind extends FixedHexBlobKind {
    /**
     * Encodes the input data into a Uint8Array, trimming leading zeros.
     *
     * @param data - The data to encode, expected to be a '0x' prefixed hex string.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Uint8Array.
     */
    data(data: RLPInput, context: string): DataOutput;
    /**
     * Decodes the input buffer into a number or hexadecimal string, ensuring it meets the fixed size by padding with zeros.
     *
     * @param buffer - The buffer to decode, containing numeric data.
     * @param context - Descriptive context for error messages, usually representing the caller's identity.
     * @returns BufferOutput object with a decode function.
     * @throws Will throw an error if buffer validation fails.
     */
    buffer(buffer: Uint8Array, context: string): BufferOutput;
}
export { CompactFixedHexBlobKind };
//# sourceMappingURL=CompactFixedHexBlobKind.d.ts.map