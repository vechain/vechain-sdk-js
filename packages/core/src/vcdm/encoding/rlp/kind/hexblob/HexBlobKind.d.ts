import { type BufferOutput, type DataOutput, type RLPInput } from '../../types';
import { ScalarKind } from '../ScalarKind';
/**
 * Represents a scalar kind with hex blob functionality.
 * This class extends the {@link ScalarKind} class.
 *
 * @remarks
 * A hex blob is a hex string that is prefixed with '0x' and has even length.
 */
declare class HexBlobKind extends ScalarKind {
    /**
     * Encodes the input data into a Uint8Array.
     *
     * @param data - The data to encode, expected to be a '0x' prefixed even sized hex string.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Uint8Array.
     */
    data(data: RLPInput, context: string): DataOutput;
    /**
     * Decodes the input buffer into a hex string.
     *
     * @param buffer - The buffer to decode.
     * @param context - Context string for error handling.
     * @returns An object containing a decode function which returns the decoded hex string.
     */
    buffer(buffer: Uint8Array, _context: string): BufferOutput;
}
export { HexBlobKind };
//# sourceMappingURL=HexBlobKind.d.ts.map