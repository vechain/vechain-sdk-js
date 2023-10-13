import { ScalarKind } from './skalarkind.abstract';
import { createRlpError } from '../helpers';
import { type BufferOutput, type DataOutput, type RLPInput } from '../types';

/**
 * `BufferKind` Class - Manages buffers and ensures type safety with encode/decode methods.
 */
class BufferKind extends ScalarKind {
    public data(data: RLPInput, context: string): DataOutput {
        // Ensure that the data is indeed a Buffer before encoding.
        if (!Buffer.isBuffer(data)) {
            throw createRlpError(context, 'expected buffer');
        }

        return {
            encode: () => data // No transformation needed, direct Buffer.
        };
    }

    public buffer(buffer: Buffer, context: string): BufferOutput {
        // Ensure that the provided parameter is indeed a Buffer before decoding.
        if (!Buffer.isBuffer(buffer)) {
            throw createRlpError(context, 'expected buffer');
        }

        return {
            decode: () => buffer // No transformation needed, direct Buffer.
        };
    }
}

export { BufferKind };
