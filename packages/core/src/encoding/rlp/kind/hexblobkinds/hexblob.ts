import { Hex } from '../../../../vcdm';
import { ScalarKind } from '../scalarkind.abstract';
import {
    assertValidHexBlobKindBuffer,
    assertValidHexBlobKindData
} from '../../helpers';
import { type DataOutput, type BufferOutput, type RLPInput } from '../../types';

/**
 * Represents a scalar kind with hex blob functionality.
 * This class extends the {@link ScalarKind} class.
 *
 * @remarks
 * A hex blob is a hex string that is prefixed with '0x' and has even length.
 */
class HexBlobKind extends ScalarKind {
    /**
     * Encodes the input data into a Buffer.
     *
     * @param data - The data to encode, expected to be a '0x' prefixed even sized hex string.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Buffer.
     */
    public data(data: RLPInput, context: string): DataOutput {
        assertValidHexBlobKindData(data, context);

        return {
            encode: () => Buffer.from((data as string).slice(2), 'hex')
        };
    }

    /**
     * Decodes the input buffer into a hex string.
     *
     * @param buffer - The buffer to decode.
     * @param context - Context string for error handling.
     * @returns An object containing a decode function which returns the decoded hex string.
     */
    public buffer(buffer: Buffer, context: string): BufferOutput {
        assertValidHexBlobKindBuffer(buffer, context);

        return {
            decode: () => Hex.of(buffer).toString()
        };
    }
}

export { HexBlobKind };
