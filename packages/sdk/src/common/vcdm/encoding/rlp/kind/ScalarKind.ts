import {
    type BufferOutput,
    type DataOutput,
    type RLPInput,
    type RLPValidObject
} from '../types';

/* ------- RLP Profile Types ------- */
/**
 * `RLPProfile` Interface - Describes the profile of the RLP encoding.
 */
interface RLPProfile {
    name: string;
    kind: ScalarKind | ArrayKind | StructKind;
}

/**
 * `ArrayKind` Interface - Describes an array-kind in the RLP encoding profile.
 */
interface ArrayKind {
    item: RLPProfile['kind'];
}

/**
 * `StructKind` Type - Describes a structured-kind in the RLP encoding profile using an array of `RLPProfile`.
 */
type StructKind = RLPProfile[];

/**
 * `ScalarKind` Abstract Class - A base for scalar kinds providing contract for data and buffer manipulations.
 */
abstract class ScalarKind {
    /**
     * Abstract method to handle data encoding.
     * @param data - The data to encode.
     * @param context - Contextual information for error messaging.
     * @returns An object providing a mechanism to encode the data into a Uint8Array.
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
    public abstract buffer(buffer: Uint8Array, context: string): BufferOutput;
}

export { ScalarKind, type RLPProfile };
