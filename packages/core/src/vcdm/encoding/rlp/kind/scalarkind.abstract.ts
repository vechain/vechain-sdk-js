import {
    type RLPInput,
    type BufferOutput,
    type RLPValidObject,
    type DataOutput
} from '../types';

/**
 * `ScalarKind` Abstract Class - A base for scalar kinds providing contract for data and buffer manipulations.
 */
abstract class ScalarKind {
    /**
     * Abstract method to handle data encoding.
     * @param data - The data to encode.
     * @param context - Contextual information for error messaging.
     * @returns An object providing a mechanism to encode the data into a Buffer.
     */
    public abstract data(
        data: RLPInput | RLPValidObject,
        context: string
    ): DataOutput;

    /**
     * Abstract method to handle buffer decoding.
     * @param buffer - The buffer to decode.
     * @param context - Contextual information for error messaging.
     * @returns An object providing a mechanism to decode the buffer back into data.
     */
    public abstract buffer(buffer: Buffer, context: string): BufferOutput;
}

export { ScalarKind };
